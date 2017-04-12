'use strict';

var makeService = require('../make_service');

var Tokens = module.exports = makeService('MapboxTokens');

var API_TOKENS_LIST = '/tokens/v2/{owner}';
var API_TOKENS_CREATE = '/tokens/v2/{owner}';
var API_TOKENS_UPDATE_AUTHORIZATION = '/tokens/v2/{owner}/{authorization_id}';
var API_TOKENS_DELETE_AUTHORIZATION = '/tokens/v2/{owner}/{authorization_id}';
var API_TOKENS_RETRIEVE = '/tokens/v2';
var API_TOKENS_LIST_SCOPES = '/scopes/v1/{owner}';

/**
 * To retrieve a listing of tokens for a particular account.
 *
 * @param {Function} callback called with (err, tokens)
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
Tokens.prototype.listTokens = function(callback) {
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
 * @param {String} note Note attached to the token
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} callback called with (err, token)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createToken('My top secret project', ["styles:read", "fonts:read"], function(err, createdToken) {
 *   console.log(createdToken);
 * });
 */
Tokens.prototype.createToken = function(note, scopes, callback) {
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
 * @param {String} expires Time token expires in RFC 3339
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} callback called with (err, token)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.createToken('2016-09-15T19:27:53.000Z', ["styles:read", "fonts:read"], function(err, createdToken) {
 *   console.log(createdToken);
 * });
 */
Tokens.prototype.createTemporaryToken = function(expires, scopes, callback) {
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
 * @param {String} authorization_id Authorization ID
 * @param {Array} scopes List of scopes for the new token
 * @param {Function} callback called with (err, token)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.updateTokenAuthorization('auth id', ["styles:read", "fonts:read"], function(err, updatedToken) {
 *   console.log(updatedToken);
 * });
 */
Tokens.prototype.updateTokenAuthorization = function(authorization_id, scopes, callback) {
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
 * @param {String} authorization_id Authorization ID
 * @param {Function} callback called with (err, token)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.deleteTokenAuthorization('auth id', function(err) {
 * });
 */
Tokens.prototype.deleteTokenAuthorization = function(authorization_id, callback) {
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
 * @param {Function} callback called with (err, tokenResponse)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.retrieveToken(function(err, tokenResponse) {
 *   console.log(tokenResponse);
 * });
 */
Tokens.prototype.retrieveToken = function(callback) {
  return this.client({
    path: API_TOKENS_RETRIEVE,
    callback: callback
  });
};

/**
 * List scopes
 *
 * @param {String} access_token Access token
 * @param {Function} callback called with (err, scopes)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listScopes('ACCESSTOKEN', function(err, scopes) {
 *   console.log(scopes);
 * });
 */
Tokens.prototype.listScopes = function(access_token, callback) {
  return this.client({
    path: API_TOKENS_LIST_SCOPES,
    params: {
      access_token: access_token,
      owner: this.owner
    },
    callback: callback
  });
};
