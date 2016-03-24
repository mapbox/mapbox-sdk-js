'use strict';

var invariant = require('../../vendor/invariant'),
  makeService = require('../make_service'),
  constants = require('../constants');

var MapboxDistance = makeService('MapboxDistance');

/**
 * Compute a table of travel-time estimates between a set of waypoints.
 * Consult the [Mapbox Distance API](https://www.mapbox.com/developers/api/distance/)
 * for more documentation.
 *
 * @param {Array<Array<number>>} waypoints an array of coordinate pairs
 * in [longitude, latitude] order. Up to
 * 100 waypoints can be specified.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {Function} callback called with (err, results)
 * @returns {undefined} nothing, calls callback
 * @memberof MapboxClient
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * // With options
 * mapboxClient.getDistances([
 *   [-95.4431142, 33.6875431],
 *   [-95.0431142, 33.6875431],
 *   [-95.0431142, 33.0875431],
 *   [-95.0431142, 33.0175431],
 *   [-95.4831142, 33.6875431]
 * ], {
 *   profile: 'walking'
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
MapboxDistance.prototype.getDistances = function(waypoints, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant(Array.isArray(waypoints), 'waypoints must be an array');

  var profile = 'driving';

  if (options.profile) {
    invariant(typeof options.profile === 'string', 'profile option must be string');
    profile = options.profile;
  }

  return this.client({
    path: constants.API_DISTANCE,
    params: {
      profile: profile
    },
    entity: {
      coordinates: waypoints
    },
    method: 'post',
    callback: callback
  }).entity();
};

module.exports = MapboxDistance;
