'use strict';

var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Tokens API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/accounts/#tokens).
 */
var Tokens = {};

/**
 * List your access tokens.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/accounts/#list-tokens).
 *
 * @return {MapiRequest}
 *
 * @example
 * tokensClient.listTokens()
 *   .send()
 *   .then(response => {
 *     const tokens = response.body;
 *   });
 */
Tokens.listTokens = function() {
  return this.client.createRequest({
    method: 'GET',
    path: '/tokens/v2/:ownerId'
  });
};

/**
 * Create a new access token.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/accounts/#create-a-token).
 *
 * @param {Object} [config]
 * @param {string} [config.note]
 * @param {Array<string>} [config.scopes]
 * @param {Array<string>} [config.resources]
 * @param {Array<string>} [config.allowedUrls]
 * @return {MapiRequest}
 *
 * @example
 * tokensClient.createToken({
 *   note: 'datasets-token',
 *   scopes: ['datasets:write', 'datasets:read']
 * })
 *   .send()
 *   .then(response => {
 *     const token = response.body;
 *   });
 */
Tokens.createToken = function(config) {
  config = config || {};
  v.assertShape({
    note: v.string,
    scopes: v.arrayOf(v.string),
    resources: v.arrayOf(v.string),
    allowedUrls: v.arrayOf(v.string)
  })(config);

  var body = {};
  body.scopes = config.scopes || [];
  if (config.note !== undefined) {
    body.note = config.note;
  }
  if (config.resources) {
    body.resources = config.resources;
  }
  if (config.allowedUrls) {
    body.allowedUrls = config.allowedUrls;
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
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/accounts/#create-a-temporary-token).
 *
 * @param {Object} config
 * @param {string} config.expires
 * @param {Array<string>} config.scopes
 * @return {MapiRequest}
 *
 * @example
 * tokensClient.createTemporaryToken({
 *   scopes: ['datasets:write', 'datasets:read']
 * })
 *   .send()
 *   .then(response => {
 *     const token = response.body;
 *   });
 */
Tokens.createTemporaryToken = function(config) {
  v.assertShape({
    expires: v.required(v.date),
    scopes: v.required(v.arrayOf(v.string))
  })(config);

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
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/accounts/#update-a-token).
 *
 * @param {Object} config
 * @param {string} config.tokenId
 * @param {string} [config.note]
 * @param {Array<string>} [config.scopes]
 * @param {Array<string>} [config.resources]
 * @param {Array<string>} [config.allowedUrls]
 * @return {MapiRequest}
 *
 * @example
 * tokensClient.updateToken({
 *   tokenId: 'cijucimbe000brbkt48d0dhcx',
 *   note: 'datasets-token',
 *   scopes: ['datasets:write', 'datasets:read']
 * })
 *   .send()
 *   .then(response => {
 *     const token = response.body;
 *   });
 */
Tokens.updateToken = function(config) {
  v.assertShape({
    tokenId: v.required(v.string),
    note: v.string,
    scopes: v.arrayOf(v.string),
    resources: v.arrayOf(v.string),
    allowedUrls: v.arrayOf(v.string)
  })(config);

  var body = {};
  if (config.scopes) {
    body.scopes = config.scopes;
  }
  if (config.note !== undefined) {
    body.note = config.note;
  }
  if (config.resources || config.resources === null) {
    body.resources = config.resources;
  }
  if (config.allowedUrls || config.allowedUrls === null) {
    body.allowedUrls = config.allowedUrls;
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
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/accounts/#retrieve-a-token).
 *
 * @return {MapiRequest}
 *
 * @example
 * tokensClient.getToken()
 *   .send()
 *   .then(response => {
 *     const token = response.body;
 *   });
 */
Tokens.getToken = function() {
  return this.client.createRequest({
    method: 'GET',
    path: '/tokens/v2'
  });
};

/**
 * Delete an access token.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/accounts/#delete-a-token).
 *
 * @param {Object} config
 * @param {string} config.tokenId
 * @return {MapiRequest}
 *
 * @example
 * tokensClient.deleteToken({
 *   tokenId: 'cijucimbe000brbkt48d0dhcx'
 * })
 *   .send()
 *   .then(response => {
 *     // Token successfully deleted.
 *   });
 */
Tokens.deleteToken = function(config) {
  v.assertShape({
    tokenId: v.required(v.string)
  })(config);

  return this.client.createRequest({
    method: 'DELETE',
    path: '/tokens/v2/:ownerId/:tokenId',
    params: pick(config, ['ownerId', 'tokenId'])
  });
};

/**
 * List your available scopes. Each item is a metadata
 * object about the scope, not just the string scope.
 *
 * See the [corresponding HTTP service documentation](https://docs.mapbox.com/api/accounts/#list-scopes).
 *
 * @return {MapiRequest}
 *
 * @example
 * tokensClient.listScopes()
 *   .send()
 *   .then(response => {
 *     const scopes = response.body;
 *   });
 */
Tokens.listScopes = function() {
  return this.client.createRequest({
    method: 'GET',
    path: '/scopes/v1/:ownerId'
  });
};

module.exports = createServiceFactory(Tokens);
