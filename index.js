'use strict';

/**
 * Serverless Base Path Plugin
 */

module.exports = function (S) {

    const path = require('path'),
        fs = require('fs'),
        BbPromise = require('bluebird');

    /**
     * ServerlessPluginBoierplate
     */

    class ServerlessBasePathPlugin extends S.classes.Plugin {

        /**
         * Constructor
         */
        constructor() {
            super();
            this.name = 'ServerlessBasePath'
        }

        static getName() {
            return 'com.daffinity.' + ServerlessBasePathPlugin;
        }

        registerActions() {
            S.addAction(this._prefixEndpoints.bind(this), {
                handler: 'registerHooks',
                context: 'custom',
                contextAction: 'run',

            });
        }

        /**
         * Register Hooks
         */
        registerHooks() {
            S.addHook(this._prefixEndpoints.bind(this), {
                action: 'endpointBuildApiGateway',
                event: 'pre'
            });

            return BbPromise.resolve();
        }

        /**
         * Endpoint Build API Gateway Pre Hook
         * This adds the basePath from the Component to each Function Endpoint path.
         */
        _prefixEndpoints(evt) {
            let endpoint = S.getProject().getEndpoint(evt.options.name);
            let basePath = S.getProject().custom.basePath;
            let _e = endpoint.toObject();
            let endpointName = `${basePath + _e.path}`;

            if (!basePath) return BbPromise.resolve(evt);

            //set base path to endpoint
            _e.path = endpointName;
            endpoint.fromObject(_e);
            evt.options.name = `${endpointName}~${_e.method}`;

            return BbPromise.resolve(evt);
        }
    }

    // Export Plugin Class
    return ServerlessBasePathPlugin;
};
