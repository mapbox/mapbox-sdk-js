'use strict';

var request = require('request'),
  API = require('./constants').API;

/**
 * The JavaScript API to Mapbox services
 *
 * @class
 * @throws {Error} if accessToken is not provided
 * @param {string} accessToken a private or public access token
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 */
function MapboxClient(accessToken) {
  if (typeof accessToken !== 'string') {
    throw new Error('accessToken required to instantiate MapboxClient');
  }
  this.accessToken = accessToken;
}

/**
 * Search for a location with a string.
 *
 * @param {string} query desired location
 * @param {Function} callback called with (err, results)
 * @returns {undefined} calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocode('Paris, France', function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 */
MapboxClient.prototype.geocode = function(query, callback) {
  request(API, function(err, res) {
    callback(err, res);
  });
};

module.exports = MapboxClient;
