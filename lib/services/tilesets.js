'use strict';

var invariant = require('../../vendor/invariant');
var makeService = require('../make_service');

/**
 * @class MapboxTilesets
 */
var MapboxTilesets = module.exports = makeService('MapboxTilesets');

var API_TILESETS_TILEQUERY = '/v4/{mapid}/tilequery/{longitude},{latitude}.json{?access_token,radius,limit}';
var API_TILESETS_LIST = '/tilesets/v1/{owner}{?access_token,limit}';

/**
 * Retrieve data about specific vector features at a specified location within a vector tileset
 *
 * @param {String} mapid Map ID of the tileset to query (eg. mapbox.mapbox-streets-v7)
 * @param {Array} position An array in the form [longitude, latitude] of the position to query
 * @param {Object} [options] optional options
 * @param {Number} options.radius Approximate distance in meters to query for features
 * @param {Number} options.limit Number of features between 1-50 to return
 * @param {Function} [callback] called with (err, results, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.tilequery('mapbox.mapbox-streets-v7', [-77, 38], {}, function(err, response) {
 *   console.log(response);
 * });
 */
MapboxTilesets.prototype.tilequery = function(mapid, position, options, callback) {
  invariant(typeof mapid === 'string', 'mapid must be a string');
  invariant(typeof position === 'object', 'position must be an array');
  invariant(position.length == 2, 'position must be an array of length 2');
  invariant(typeof position[0] === 'number' && typeof position[1] === 'number', 'position must be an array of two numbers');

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  return this.client({
    path: API_TILESETS_TILEQUERY,
    params: {
      mapid: mapid,
      longitude: position[0],
      latitude: position[1],
      radius: options.radius,
      limit: options.limit
    },
    callback: callback
  });
};

/**
 * Retrieve all tilesets
 *
 * @param {Object} [options] optional options
 * @param {Number} options.limit Maximum Number of tilesets to return
 * @param {Function} [callback] called with (err, tilesets, response)
 * @returns {Promise} response
 * @example
 * var MapboxClient = require('mapbox');
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.listTilesets(function(err, tilesets) {
 *   console.log(tilesets);
 * });
 */
MapboxTilesets.prototype.listTilesets = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = options || {};

  return this.client({
    path: API_TILESETS_LIST,
    params: {
      owner: this.owner,
      limit: options.limit
    },
    callback: callback
  });
};
