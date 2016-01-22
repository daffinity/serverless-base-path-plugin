# Serverless Base Path Plugin

This is a [Serverless](https://serverless.com) plugin for setting a base path for all API Gateway endpoints in a Component.


# Usage

Prefix Endpoint paths on deploy by adding the `basePath` to the `custom` Object in `s-component.json`.

### Example s-component.json
```json
{
  "name": "nodejscomponent",
  "runtime": "nodejs",
  "custom": {
    "basePath": "api/"
  }
}
```

Keep in mind that currently it may take multiple deploys to work properly and any pre-existing endpoints will remain.


# TODO

- Detect changes to the `basePath` value and update Endpoints as needed.
- Automatically remove previous `basePath` values from functions if the custom key is removed.
- Project level custom key support.
- Module level custom key support.
- Automatically add a trailing `/` if its missing from the `basePath`.


