'use strict';

var invariant = require('../../vendor/invariant');
var formatPoints = require('../format_points');
var makeService = require('../make_service');

/**
 * @class MapboxMatrix
 */
var MapboxMatrix = makeService('MapboxMatrix');

var API_MATRIX = '/directions-matrix/v1/mapbox/{profile}/{encodedWaypoints}.json{?access_token}';

/**
 * Compute a table of travel-time estimates between a set of waypoints.
 * Consult the [Mapbox Matrix API](https://www.mapbox.com/api-documentation/#matrix)
 * for more documentation and limits.
 *
 * @param {Array<Object>} waypoints an array of coordinate objects
 * in the form `{longitude: 0, latitude: 0}`.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle. The `'driving-traffic'` profile is not supported.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * // Without options
 * mapboxClient.getMatrix([{
 *   longitude: -122.42,
 *   latitude: 37.78
 * },
 * {
 *   longitude: -122.45,
 *   latitude: 37.91
 * },
 * {
 *   longitude: -122.48,
 *   latitude: 37.73
 * }], {
 * }, function(err, results) {
 *   console.log(results);
 * });
 *
 * // With options
 * mapboxClient.getMatrix([{
 *   longitude: -122.42,
 *   latitude: 37.78
 * },
 * {
 *   longitude: -122.45,
 *   latitude: 37.91
 * },
 * {
 *   longitude: -122.48,
 *   latitude: 37.73
 * }], { profile: 'walking' }, {
 * }, function(err, results) {
 *   console.log(results);
 * });
 *
 * // Results is an object like:
 * { durations:
 *   [ [ 0, 1196, 3977, 3415, 5196 ],
 *     [ 1207, 0, 3775, 3213, 4993 ],
 *     [ 3976, 3774, 0, 2650, 2579 ],
 *     [ 3415, 3212, 2650, 0, 3869 ],
 *     [ 5208, 5006, 2579, 3882, 0 ] ] }
 *
 * // If the coordinates include an un-routable place, then
 * // the table may contain 'null' values to indicate this, like
 * { durations:
 *   [ [ 0, 11642, 57965, null, 72782 ],
 *     [ 11642, 0, 56394, null, 69918 ],
 *     [ 57965, 56394, 0, null, 19284 ],
 *     [ null, null, null, 0, null ],
 *     [ 72782, 69918, 19284, null, 0 ] ] }
 */

MapboxMatrix.prototype.getMatrix = function(waypoints, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  } else if (options === undefined) {
    options = {};
  }

  // typecheck arguments
  invariant(Array.isArray(waypoints), 'waypoints must be an array');
  invariant(typeof options === 'object', 'options must be an object');

  var encodedWaypoints = formatPoints(waypoints);

  var params = {
    encodedWaypoints: encodedWaypoints,
    profile: 'driving'
  };

  if (options.profile) {
    invariant(typeof options.profile === 'string', 'profile option must be string');
    params.profile = options.profile;
  }

  return this.client({
    path: API_MATRIX,
    params: params,
    callback: callback
  });
};

module.exports = MapboxMatrix;
