'use strict';

/**
 * Serverless Base Path Plugin
 */

module.exports = function(ServerlessPlugin) {

  const path    = require('path'),
      fs        = require('fs'),
      BbPromise = require('bluebird');

  /**
   * ServerlessPluginBoierplate
   */

  class ServerlessBasePathPlugin extends ServerlessPlugin {

    /**
     * Constructor
     */

    constructor(S) {
      super(S);
    }

    static getName() {
      return 'com.daffinity.' + ServerlessBasePathPlugin.name;
    }

    /**
     * Register Hooks
     */

    registerHooks() {

      this.S.addHook(this._prefixEndpoints.bind(this), {
        action: 'endpointBuildApiGateway',
        event:  'pre'
      });

      return BbPromise.resolve();
    }

    /**
     * Endpoint Build API Gateway Pre Hook
     * This adds the basePath from the Component to each Function Endpoint path.
     */

    _prefixEndpoints(evt) {
      // Validate: Check Serverless version.
      if (parseInt(this.S._version.split('.')[1]) < 1) {
        console.log("WARNING: This version of the Serverless Base Path Plugin will not work with a version of Serverless that is less than v0.1.");
      }

      // Get the component and endpoint.
      let component = this.S.state.getComponents({ paths: evt.options.path })[0],
          endpoint = this.S.state.getEndpoints({ paths: evt.options.path })[0];

      // Skip if no basePath is set on the component.
      // TODO: Store old base paths with the function and remove them if changed or removed in the component config.
      if (!component.custom || !component.custom.basePath) {
        return BbPromise.resolve(evt);
      }

      let basePath = component.custom.basePath;

      // Set the base path for API Gateway endpoint if it isn't already.
      if (!endpoint.path.startsWith(basePath)) {
        endpoint.path = basePath + endpoint.path;
        endpoint.save(function () {
          BbPromise.resolve(evt);
        });
      } else {
        // Otherwise, skip plugin
        return BbPromise.resolve(evt);
      }
    }
  }

  // Export Plugin Class
  return ServerlessBasePathPlugin;

};


