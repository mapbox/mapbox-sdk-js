'use strict';

var invariant = require('../../vendor/invariant');
var formatPoints = require('../format_points');
var makeService = require('../make_service');

/**
 * @class MapboxDirections
 */
var MapboxDirections = makeService('MapboxDirections');

var API_DIRECTIONS = '/directions/v5/{account}/{profile}/{encodedWaypoints}.json{?access_token,alternatives,geometries,overview,radiuses,steps,continue_straight,bearings}';

/**
 * Find directions from A to B, or between any number of locations.
 * Consult the [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions)
 * for more documentation.
 *
 * @param {Array<Object>} waypoints an array of objects with `latitude`
 * and `longitude` properties that represent waypoints in order. Up to
 * 25 waypoints can be specified.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.profile=driving] the directions
 * profile, which determines how to prioritize different routes.
 * Options are `'driving-traffic'` for automotive routing which factors
 * in current and historic traffic conditions to avoid slowdowns,
 * `'driving'`, which assumes transportation via an
 * automobile and will use highways, `'walking'`, which avoids
 * streets without sidewalks, and `'cycling'`, which prefers streets
 * with bicycle lanes and lower speed limits for transportation via
 * bicycle.
 * @param {string} [options.account=mapbox] Account for the profile.
 * @param {string} [options.alternatives=true] whether to generate
 * alternative routes along with the preferred route.
 * @param {string} [options.geometries=geojson] format for the returned
 * route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline`
 * yields more compact responses which can be decoded on the client side.
 * [GeoJSON](http://geojson.org/), the default, is compatible with libraries
 * like [Mapbox GL](https://www.mapbox.com/mapbox-gl/),
 * Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false`
 * omits the geometry entirely and only returns instructions.
 * @param {string} [options.overview=simplified] type of returned overview
 * geometry. Can be `full` (the most detailed geometry available), `simplified`
 * (a simplified version of the full geometry), or `false`.
 * @param {Array<number|string>} [options.radiuses] an array of integers in meters
 * indicating the maximum distance each coordinate is allowed to move when
 * snapped to a nearby road segment. There must be as many radiuses as there
 * are coordinates in the request. Values can be any number greater than `0` or
 * they can be the string `unlimited`. If no routable road is found within the
 * radius, a `NoSegment` error is returned.
 * @param {boolean} [options.steps=false] whether to return steps and
 * turn-by-turn instructions. Can be `true` or `false`.
 * @param {boolean} [options.continue_straight] sets allowed direction of travel
 * when departing intermediate waypoints. If `true` the route will continue in
 * the same direction of travel. If `false` the route may continue in the
 * opposite direction of travel. Defaults to `true` for the `driving` profile
 * and `false` for the `walking` and `cycling` profiles.
 * @param {Array<Array>} [options.bearings] used to filter the road
 * segment the waypoint will be placed on by direction and dictates the angle
 * of approach. This option should always be used in conjunction with the
 * `radiuses` option. The parameter takes two values per waypoint: the first is
 * an angle clockwise from true north between `0` and `360`. The second is the
 * range of degrees the angle can deviate by. We recommend a value of `45` or
 * `90` for the range, as bearing measurements tend to be inaccurate. This is
 * useful for making sure we reroute vehicles on new routes that continue
 * traveling in their current direction. A request that does this would provide
 * bearing and radius values for the first waypoint and leave the remaining
 * values empty.If provided, the list of bearings must be the same length as
 * the list of waypoints, but you can skip a coordinate and show its position
 * by providing an empty array.
 * @param {Function} callback called with (err, results)
 * @returns {Promise} response
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 * mapboxClient.getDirections(
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
 *   profile: 'walking',
 *   alternatives: false,
 *   geometry: 'polyline'
 * }, function(err, results) {
 *   console.log(results);
 * });
 */
MapboxDirections.prototype.getDirections = function(waypoints, options, callback) {

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
    profile: 'driving',
    account: 'mapbox',
    alternatives: true,
    steps: true,
    geometries: 'geojson'
  };

  if (options.profile) {
    invariant(typeof options.profile === 'string', 'profile option must be string');
    params.profile = options.profile;
  }

  if (options.account) {
    invariant(typeof options.account === 'string', 'account option must be string');
    params.account = options.account;
  }

  if (typeof options.alternatives !== 'undefined') {
    invariant(typeof options.alternatives === 'boolean', 'alternatives option must be boolean');
    params.alternatives = options.alternatives;
  }

  if (options.radiuses) {
    invariant(Array.isArray(options.radiuses), 'radiuses must be an array');
    invariant(options.radiuses.length === waypoints.length, 'There must be as many radiuses as there are waypoints in the request');
    params.radiuses = options.radiuses.join(';');
  }

  if (typeof options.steps !== 'undefined') {
    invariant(typeof options.steps === 'boolean', 'steps option must be boolean');
    params.steps = options.steps;
  }

  var allowedGeometries = ['polyline', 'geojson'];
  if (options.geometries) {
    invariant(allowedGeometries.indexOf(options.geometries) !== -1, 'geometries option must be ' + allowedGeometries);
    params.geometries = options.geometries;
  }

  var allowedOverviews = ['simplified', 'full'];
  if (options.overview) {
    invariant(allowedOverviews.indexOf(options.overview) !== -1, 'overview option must be ' + allowedOverviews);
    params.overview = options.overview;
  }

  if (typeof options.continue_straight !== 'undefined') {
    invariant(typeof options.continue_straight === 'boolean', 'continue_straight option must be boolean');
    params.continue_straight = options.continue_straight;
  }

  if (options.bearings) {
    invariant(Array.isArray(options.radiuses), 'bearings must be an array');
    invariant(options.bearings.length === waypoints.length, 'There must be as many bearings as there are waypoints in the request');
    params.bearings = options.bearings.join(';');
  }

  return this.client({
    path: API_DIRECTIONS,
    params: params,
    callback: callback
  });
};

module.exports = MapboxDirections;
