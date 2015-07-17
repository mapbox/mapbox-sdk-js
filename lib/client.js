'use strict';

var assert = require('assert'),
  resolveToString = require('es6-template-strings/resolve-to-string'),
  qs = require('querystring'),
  request = require('superagent'),
  constants = require('./constants');

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
  assert(typeof accessToken === 'string',
    'accessToken required to instantiate MapboxClient');
  this.accessToken = accessToken;
}

MapboxClient.prototype.q = function(options) {
  options.access_token = this.accessToken;
  return '?' + qs.stringify(options);
};

/**
 * Search for a location with a string.
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
MapboxClient.prototype.geocodeForward = function(query, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  assert(typeof query === 'string', 'query must be a string');
  assert(typeof options === 'object', 'options must be an object');
  assert(typeof callback === 'function', 'callback must be a function');

  var queryOptions = {};
  if (options.proximity) {
    assert(typeof options.proximity.latitude === 'number' &&
      typeof options.proximity.longitude === 'number',
      'proximity must be an object with numeric latitude & longitude properties');
    queryOptions.proximity = options.proximity.longitude + ',' + options.proximity.latitude;
  }

  var dataset = 'mapbox.places';
  if (options.dataset) {
    assert(typeof options.dataset === 'string', 'dataset option must be string');
    dataset = options.dataset;
  }

  var url = resolveToString(constants.API_GEOCODER_FORWARD, {
    query: query,
    dataset: dataset
  }) + this.q(queryOptions);

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * Given a location, determine what geographical features are located
 * there.
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
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.geocodeReverse(
 *   { latitude: 33.6875431, longitude: -95.4431142 },
 *   function(err, res) {
 *   // res is a GeoJSON document with geocoding matches
 * });
 */
MapboxClient.prototype.geocodeReverse = function(location, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  assert(typeof location === 'object', 'location must be an object');
  assert(typeof options === 'object', 'options must be an object');
  assert(typeof callback === 'function', 'callback must be a function');

  assert(typeof location.latitude === 'number' &&
    typeof location.longitude === 'number',
    'location must be an object with numeric latitude & longitude properties');

  var dataset = 'mapbox.places';
  if (options.dataset) {
    assert(typeof options.dataset === 'string', 'dataset option must be string');
    dataset = options.dataset;
  }

  var url = resolveToString(constants.API_GEOCODER_REVERSE, {
    location: location,
    dataset: dataset
  }) + this.q({});

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

/**
 * Find directions from A to B, or between any number of locations.
 * Consult the [Mapbox Directions API](https://www.mapbox.com/developers/api/directions/)
 * for more documentation.
 *
 * @param {Array<Object>} waypoints an array of objects with `latitude`
 * and `longitude` properties that represent waypoints in order. Up to
 * 25 waypoints can be specified.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=mapbox.driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'mapbox.driving'`, which assumes transportation via an
 * automobile and will use highways, `'mapbox.walking'`, which avoids
 * streets without sidewalks, and `'mapbox.cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {string} [options.alternatives=true] whether to generate
 * alternative routes along with the preferred route.
 * @param {string} [options.instructions=text] format for turn-by-turn
 * instructions along the route.
 * @param {string} [options.geometry=geojson] format for the returned
 * route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline`
 * yields more compact responses which can be decoded on the client side.
 * [GeoJSON](http://geojson.org/), the default, is compatible with libraries
 * like [Mapbox GL](https://www.mapbox.com/mapbox-gl/),
 * Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false`
 * omits the geometry entirely and only returns instructions.
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.directions(
 *   [
 *     { latitude: 33.6, longitude: -95.4431 },
 *     { latitude: 33.2, longitude: -95.4431 } ],
 *   function(err, res) {
 *   // res is a document with directions
 * });
 *
 * // With options
 * mapboxClient.getDirections([
 *   { latitude: 33.6875431, longitude: -95.4431142 },
 *   { latitude: 33.6875431, longitude: -95.4831142 }
 * ], {
 *   profile: 'mapbox.walking',
 *   instructions: 'html',
 *   alternatives: false,
 *   geometry: 'polyline'
 * }, function(err, results) {
 *   console.log(results.origin);
 * });
 */
MapboxClient.prototype.getDirections = function(waypoints, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  assert(Array.isArray(waypoints), 'waypoints must be an array');
  assert(typeof options === 'object', 'options must be an object');
  assert(typeof callback === 'function', 'callback must be a function');

  var encodedWaypoints = waypoints.map(function(location) {
    assert(typeof location.latitude === 'number' &&
      typeof location.longitude === 'number',
      'location must be an object with numeric latitude & longitude properties');
    return location.longitude + ',' + location.latitude;
  }).join(';');

  var profile = 'mapbox.driving',
    alternatives = true,
    geometry = 'geojson',
    instructions = 'text';

  if (options.profile) {
    assert(typeof options.profile === 'string', 'profile option must be string');
    profile = options.profile;
  }

  if (options.instructions) {
    assert(typeof options.instructions === 'string', 'instructions option must be string');
    instructions = options.instructions;
  }

  if (options.geometry) {
    assert(typeof options.geometry === 'string', 'geometry option must be string');
    geometry = options.geometry;
  }

  var url = resolveToString(constants.API_DIRECTIONS, {
    encodedWaypoints: encodedWaypoints,
    profile: profile
  }) + this.q({
    instructions: instructions,
    geometry: geometry,
    alternatives: alternatives
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

module.exports = MapboxClient;
