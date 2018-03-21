'use strict';

var invariant = require('../../vendor/invariant');
var makeService = require('../make_service');

/**
 * @class MapboxMatching
 */
var MapboxMatching = makeService('MapboxMatching');

var API_MATCHING = '/matching/v5/{account}/{profile}/{coordinates}.json{?access_token,geometries,radiuses,steps,overview,timestamps,annotations}';

/**
 * Snap recorded location traces to roads and paths from OpenStreetMap.
 * Consult the [Map Matching API](https://www.mapbox.com/api-documentation/#map-matching)
 * for more documentation.
 *
 * @param {Array<Array<number>>} coordinates an array of coordinate pairs
 * in [longitude, latitude] order. Up to 100 coordinates can be specified.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {string} [options.geometries=geojson] format of the returned geometry.
 * Allowed values are: `'geojson'` (as LineString), `'polyline'` with
 * precision 5, `'polyline6'`. `'polyline'` yields more compact responses which
 * can be decoded on the client side. [GeoJSON](http://geojson.org/), the
 * default, is compatible with libraries like
 * [Mapbox GL](https://www.mapbox.com/mapbox-gl/), Leaflet and
 * [Mapbox.js](https://www.mapbox.com/mapbox.js/).
 * @param {Array<number>} [options.radiuses] an array of integers in meters
 * indicating the assumed precision of the used tracking device. There must be
 * as many radiuses as there are coordinates in the request. Values can be a
 * number between 0 and 30. Use higher numbers (20-30) for noisy traces and
 * lower numbers (1-10) for clean traces. The default value is 5.
 * @param {boolean} [options.steps=false] Whether to return steps and
 * turn-by-turn instructions. Can be `true` or `false`.
 * @param {string|boolean} [options.overview=simplified] type of returned
 * overview geometry. Can be `'full'` (the most detailed geometry available),
 * `'simplified'` (a simplified version of the full geometry), or `false`.
 * @param {Array<number>} [options.timestamps] an array of timestamps
 * corresponding to each coordinate provided in the request; must be numbers in
 * [Unix time](https://en.wikipedia.org/wiki/Unix_time)
 * (seconds since the Unix epoch). There must be as many timestamps as there
 * are coordinates in the request.
 * @param {Array<string>} [options.annotations] an array of fields that return
 * additional metadata for each coordinate along the match geometry. Can be any
 * of `'duration'`, `'distance'`, or `'nodes'`.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.matching([
 *   [-95.4431142, 33.6875431],
 *   [-95.0431142, 33.6875431],
 *   [-95.0431142, 33.0875431],
 *   [-95.0431142, 33.0175431],
 *   [-95.4831142, 33.6875431]
 * ], {
 *  overview: 'full'
 * }, function(err, res) {
 *   // res is a match response object
 * });
 */
MapboxMatching.prototype.matching = function(coordinates, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant(Array.isArray(coordinates), 'coordinates must be an array');

  var params = {
    profile: 'driving',
    account: 'mapbox',
    geometries: 'geojson',
    coordinates: coordinates.join(';')
  };

  if (options.profile) {
    invariant(typeof options.profile === 'string', 'profile option must be string');
    params.profile = options.profile;
  }

  var allowedGeometries = ['polyline', 'geojson'];
  if (options.geometries) {
    invariant(allowedGeometries.indexOf(options.geometries) !== -1, 'geometries option must be ' + allowedGeometries);
    params.geometries = options.geometries;
  }

  if (options.radiuses) {
    invariant(Array.isArray(options.radiuses), 'radiuses must be an array');
    invariant(options.radiuses.length === coordinates.length, 'There must be as many radiuses as there are coordinates in the request');
    params.radiuses = options.radiuses.join(';');
  }

  if (typeof options.steps !== 'undefined') {
    invariant(typeof options.steps === 'boolean', 'steps option must be boolean');
    params.steps = options.steps;
  }

  var allowedOverview = ['full', 'simplified'];
  if (typeof options.overview !== 'undefined') {
    invariant(allowedOverview.indexOf(options.overview) !== -1 || options.overview === false, 'overview option must be ' + allowedOverview + ' or false');
    params.overview = options.overview;
  }

  if (options.timestamps) {
    invariant(Array.isArray(options.timestamps), 'timestamps must be an array');
    invariant(options.timestamps.length === coordinates.length, 'There must be as many timestamps as there are coordinates in the request');
    params.timestamps = options.timestamps.join(';');
  }

  if (options.annotations) {
    invariant(Array.isArray(options.annotations), 'annotations must be an array');
    params.annotations = options.annotations.join();
  }

  return this.client({
    path: API_MATCHING,
    params: params,
    method: 'get',
    callback: callback
  });
};

module.exports = MapboxMatching;
