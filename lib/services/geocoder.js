'use strict';

var invariant = require('invariant'),
  request = require('superagent'),
  makeService = require('../make_service'),
  makeURL = require('../make_url'),
  constants = require('../constants');

var MapboxGeocoder = makeService('MapboxGeocoder');

/**
 * Search for a location with a string, using the
 * [Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).
 *
 * @param {string} query desired location
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {Object} options.proximity a proximity argument: this is
 * a geographical point given as an object with latitude and longitude
 * properties. Search results closer to this point will be given
 * higher priority.
 * @param {string} [options.dataset=mapbox.places] the desired data to be
 * geocoded against. The default, mapbox.places, does not permit unlimited
 * caching. `mapbox.places-permanent` is available on request and does
 * permit permanent caching.
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @memberof MapboxClient
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeForward('Paris, France', function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 * // using the proximity option to weight results closer to texas
 * mapboxClient.geocodeForward('Paris, France', {
 *   proximity: { latitude: 33.6875431, longitude: -95.4431142 }
 * }, function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 */
MapboxGeocoder.prototype.geocodeForward = function(query, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant(typeof query === 'string', 'query must be a string');
  invariant(typeof options === 'object', 'options must be an object');
  invariant(typeof callback === 'function', 'callback must be a function');

  var queryOptions = {};
  if (options.proximity) {
    invariant(typeof options.proximity.latitude === 'number' &&
      typeof options.proximity.longitude === 'number',
      'proximity must be an object with numeric latitude & longitude properties');
    queryOptions.proximity = options.proximity.longitude + ',' + options.proximity.latitude;
  }

  var dataset = 'mapbox.places';
  if (options.dataset) {
    invariant(typeof options.dataset === 'string', 'dataset option must be string');
    dataset = options.dataset;
  }

  var url = makeURL(this, constants.API_GEOCODER_FORWARD, {
    forwardQuery: query,
    dataset: dataset
  }, queryOptions);

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * Given a location, determine what geographical features are located
 * there. This uses the [Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).
 *
 * @param {Object} location the geographical point to search
 * @param {number} location.latitude decimal degrees latitude, in range -90 to 90
 * @param {number} location.longitude decimal degrees longitude, in range -180 to 180
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.dataset=mapbox.places] the desired data to be
 * geocoded against. The default, mapbox.places, does not permit unlimited
 * caching. `mapbox.places-permanent` is available on request and does
 * permit permanent caching.
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxGeocoder('ACCESSTOKEN');
 * mapboxClient.geocodeReverse(
 *   { latitude: 33.6875431, longitude: -95.4431142 },
 *   function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 */
MapboxGeocoder.prototype.geocodeReverse = function(location, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant(typeof location === 'object', 'location must be an object');
  invariant(typeof options === 'object', 'options must be an object');
  invariant(typeof callback === 'function', 'callback must be a function');

  invariant(typeof location.latitude === 'number' &&
    typeof location.longitude === 'number',
    'location must be an object with numeric latitude & longitude properties');

  var dataset = 'mapbox.places';
  if (options.dataset) {
    invariant(typeof options.dataset === 'string', 'dataset option must be string');
    dataset = options.dataset;
  }

  var url = makeURL(this, constants.API_GEOCODER_REVERSE, {
    location: location,
    dataset: dataset
  }, {});

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

module.exports = MapboxGeocoder;
