'use strict';

var invariant = require('invariant'),
  request = require('superagent'),
  formatPoints = require('../format_points'),
  makeService = require('../make_service'),
  makeURL = require('../make_url'),
  constants = require('../constants');

// Teach request about our GeoJSON Content-Type
request.parse['application/vnd.geo+json'] = JSON.parse;

var MapboxDirections = makeService('MapboxDirections');

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
 * @memberof MapboxClient
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
MapboxDirections.prototype.getDirections = function(waypoints, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant(Array.isArray(waypoints), 'waypoints must be an array');
  invariant(typeof options === 'object', 'options must be an object');
  invariant(typeof callback === 'function', 'callback must be a function');

  var encodedWaypoints = formatPoints(waypoints);

  var profile = 'mapbox.driving',
    alternatives = true,
    geometry = 'geojson',
    instructions = 'text';

  if (options.profile) {
    invariant(typeof options.profile === 'string', 'profile option must be string');
    profile = options.profile;
  }

  if (options.instructions) {
    invariant(typeof options.instructions === 'string', 'instructions option must be string');
    instructions = options.instructions;
  }

  if (options.geometry) {
    invariant(typeof options.geometry === 'string', 'geometry option must be string');
    geometry = options.geometry;
  }

  var url = makeURL(this, constants.API_DIRECTIONS, {
    encodedWaypoints: encodedWaypoints,
    profile: profile
  }, {
    instructions: instructions,
    geometry: geometry,
    alternatives: alternatives
  });

  request(url, function(err, res) {
    callback(err, res.body);
  });
};

module.exports = MapboxDirections;
