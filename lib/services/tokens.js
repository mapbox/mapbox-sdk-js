'use strict';

var invariant = require('../../vendor/invariant');
var makeService = require('../make_service');

/**
 * @class MapboxTokens
 */
var MapboxTokens = module.exports = makeService('MapboxTokens');

var API_TOKENS_LIST = '/tokens/v2/{owner}{?access_token}';
var API_TOKENS_CREATE = '/tokens/v2/{owner}{?access_token}';
var API_TOKENS_UPDATE_AUTHORIZATION = '/tokens/v2/{owner}/{authorization_id}{?access_token}';
var API_TOKENS_DELETE_AUTHORIZATION = '/tokens/v2/{owner}/{authorization_id}{?access_token}';
var API_TOKENS_RETRIEVE = '/tokens/v2{?access_token}';
var API_TOKENS_LIST_SCOPES = '/scopes/v1/{owner}{?access_token}';

/**
 * To retrieve a listing of tokens for a particular account.
 *
 * @param {Function} [callback] called with (err, tokens, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listTokens(function(err, tokens) {
 *   console.log(tokens);
 *   // [{ client: 'api'
 *   //  note: 'Default Public Token',
 *   //  usage: 'pk',
 *   //  id: 'TOKENID',
 *   //  default: true,
 *   //  scopes: ['styles:tiles','styles:read','fonts:read','datasets:read'],
 *   //  created: '2016-02-09T14:26:15.059Z',
 *   //  modified: '2016-02-09T14:28:31.253Z',
 *   //  token: 'pk.TOKEN' }]
 * });
 */
MapboxTokens.prototype.listTokens = function(callback) {
  return this.client({
    path: API_TOKENS_LIST,
    params: {
      owner: this.owner
    },
    callback: callback
  });
};

/**
 * Create a token
 *
 * @param {string} note Note attached to the token
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createToken('My top secret project', ["styles:read", "fonts:read"], function(err, createdToken) {
 *   console.log(createdToken);
 * });
 */
MapboxTokens.prototype.createToken = function(note, scopes, callback) {
  invariant(typeof note === 'string', 'note must be a string');
  invariant(Object.prototype.toString.call(scopes) === '[object Array]', 'scopes must be an array');

  return this.client({
    path: API_TOKENS_CREATE,
    params: {
      owner: this.owner
    },
    entity: {
      scopes: scopes,
      note: note
    },
    callback: callback
  });
};

/**
 * Create a temporary token
 *
 * @param {string} expires Time token expires in RFC 3339
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createTemporaryToken('2016-09-15T19:27:53.000Z', ["styles:read", "fonts:read"], function(err, createdToken) {
 *   console.log(createdToken);
 * });
 */
MapboxTokens.prototype.createTemporaryToken = function(expires, scopes, callback) {
  invariant(typeof expires === 'string', 'expires must be a string');
  invariant(Object.prototype.toString.call(scopes) === '[object Array]', 'scopes must be an array');

  return this.client({
    path: API_TOKENS_CREATE,
    params: {
      owner: this.owner
    },
    entity: {
      scopes: scopes,
      expires: expires
    },
    callback: callback
  });
};

/**
 * Update a token's authorization
 *
 * @param {string} authorization_id Authorization ID
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.updateTokenAuthorization('auth id', ["styles:read", "fonts:read"], function(err, updatedToken) {
 *   console.log(updatedToken);
 * });
 */
MapboxTokens.prototype.updateTokenAuthorization = function(authorization_id, scopes, callback) {
  invariant(typeof authorization_id === 'string', 'authorization_id must be a string');
  invariant(Object.prototype.toString.call(scopes) === '[object Array]', 'scopes must be an array');

  return this.client({
    path: API_TOKENS_UPDATE_AUTHORIZATION,
    params: {
      authorization_id: authorization_id,
      owner: this.owner
    },
    entity: {
      scopes: scopes
    },
    method: 'patch',
    callback: callback
  });
};

/**
 * Delete a token's authorization
 *
 * @param {string} authorization_id Authorization ID
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteTokenAuthorization('auth id', function(err) {
 * });
 */
MapboxTokens.prototype.deleteTokenAuthorization = function(authorization_id, callback) {
  invariant(typeof authorization_id === 'string', 'authorization_id must be a string');

  return this.client({
    path: API_TOKENS_DELETE_AUTHORIZATION,
    params: {
      authorization_id: authorization_id,
      owner: this.owner
    },
    method: 'delete',
    callback: callback
  });
};

/**
 * Retrieve a token
 *
 * @param {string} access_token access token to check
 * @param {Function} [callback] called with (err, token, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.retrieveToken('ACCESSTOKEN', function(err, tokenResponse) {
 *   console.log(tokenResponse);
 * });
 */
MapboxTokens.prototype.retrieveToken = function(access_token, callback) {
  invariant(typeof access_token === 'string', 'access_token must be a string');

  return this.client({
    path: API_TOKENS_RETRIEVE,
    params: {
      access_token: access_token
    },
    callback: callback
  });
};

/**
 * List scopes
 *
 * @param {Function} [callback] called with (err, scopes, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listScopes(function(err, scopes) {
 *   console.log(scopes);
 * });
 */
MapboxTokens.prototype.listScopes = function(callback) {
  return this.client({
    path: API_TOKENS_LIST_SCOPES,
    params: {
      owner: this.owner
    },
    callback: callback
  });
};
