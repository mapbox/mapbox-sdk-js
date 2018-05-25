'use strict';

var v = require('./service-helpers/validator').v;
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Tokens API service.
 */
var Tokens = {};

/**
 * List a user's access tokens.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#list-tokens).
 *
 * @param {Object} [config]
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Tokens.listTokens = function(config) {
  v.warn(
    v.shapeOf({
      ownerId: v.string
    })
  )(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tokens/v2/:ownerId',
    params: config
  });
};

/**
 * Create a new access token.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#create-token).
 *
 * `resources` are only available for users with the `token_resources`
 * feature flag.
 *
 * @param {Object} [config]
 * @param {string} [config.note]
 * @param {Array<string>} [config.scopes]
 * @param {Array<string>} [config.resources]
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Tokens.createToken = function(config) {
  config = config || {};

  v.warn(
    v.shapeOf({
      ownerId: v.string,
      note: v.string,
      scopes: v.arrayOf(v.string),
      resources: v.arrayOf(v.string)
    })
  )(config);

  var body = {};
  body.scopes = config.scopes || [];
  if (config.note !== undefined) {
    body.note = config.note;
  }
  if (config.resources) {
    body.resources = config.resources;
  }

  return this.client.createRequest({
    method: 'POST',
    path: '/tokens/v2/:ownerId',
    params: pick(config, ['ownerId']),
    body: body
  });
};

/**
 * Create a new temporary access token.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#create-temporary-token).
 *
 * @param {Object} [config]
 * @param {string} [config.expires]
 * @param {Array<string>} [config.scopes]
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Tokens.createTemporaryToken = function(config) {
  config = config || {};
  v.warn(
    v.shapeOf({
      expires: v.required(v.date),
      scopes: v.required(v.arrayOf(v.string)),
      ownerId: v.string
    })
  )(config);

  return this.client.createRequest({
    method: 'POST',
    path: '/tokens/v2/:ownerId',
    params: pick(config, ['ownerId']),
    body: {
      expires: new Date(config.expires).toISOString(),
      scopes: config.scopes
    }
  });
};

/**
 * Update an access token.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#update-a-token).
 *
 * `resources` are only available for users with the `token_resources`
 * feature flag.
 *
 * @param {Object} config
 * @param {string} config.tokenId
 * @param {string} [config.note]
 * @param {Array<string>} [config.scopes]
 * @param {Array<string>} [config.resources]
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Tokens.updateToken = function(config) {
  v.warn(
    v.shapeOf({
      tokenId: v.required(v.string),
      note: v.string,
      scopes: v.arrayOf(v.string),
      resources: v.arrayOf(v.string),
      ownerId: v.string
    })
  )(config);

  var body = {};
  if (config.scopes) {
    body.scopes = config.scopes;
  }
  if (config.note !== undefined) {
    body.note = config.note;
  }
  if (config.resources) {
    body.resources = config.resources;
  }

  return this.client.createRequest({
    method: 'PATCH',
    path: '/tokens/v2/:ownerId/:tokenId',
    params: pick(config, ['ownerId', 'tokenId']),
    body: body
  });
};

/**
 * Get data about the client's access token.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#retrieve-a-token).
 *
 * @param {Object} config
 * @return {MapiRequest}
 */
Tokens.getToken = function(config) {
  v.warn(v.shapeOf({}))(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/tokens/v2'
  });
};

/**
 * Delete an access token.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/?language=cURL#delete-a-token).
 *
 * @param {Object} config
 * @param {string} config.tokenId
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Tokens.deleteToken = function(config) {
  v.warn(
    v.shapeOf({
      tokenId: v.required(v.string),
      ownerId: v.string
    })
  )(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/tokens/v2/:ownerId/:tokenId',
    params: pick(config, ['ownerId', 'tokenId'])
  });
};

/**
 * List a user's available scopes. Each item is a metadata
 * object about the scope, not just the string scope.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#list-scopes).
 *
 * @param {Object} [config]
 * @param {string} [config.ownerId]
 * @return {MapiRequest}
 */
Tokens.listScopes = function(config) {
  v.warn(
    v.shapeOf({
      ownerId: v.string
    })
  )(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/scopes/v1/:ownerId',
    params: config
  });
};

module.exports = createServiceFactory(Tokens);
