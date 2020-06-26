'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var objectClean = require('./service-helpers/object-clean');
var stringifyBooleans = require('./service-helpers/stringify-booleans');

/**
 * Optimization API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/navigation/#optimization).
 */
var Optimization = {};

/**
 * Get a duration-optimized route.
 *
 * Please read [the full HTTP service documentation](https://docs.mapbox.com/api/navigation/#optimization)
 * to understand all of the available options.
 *
 * @param {Object} config
 * @param {'driving'|'driving-traffic'|'walking'|'cycling'} [config.profile="driving"]
 * @param {Array<OptimizationWaypoint>} config.waypoints - An ordered array of [`OptimizationWaypoint`](#optimizationwaypoint) objects, between 2 and 12 (inclusive).
 * @param {Array<'duration'|'distance'|'speed'>} [config.annotations] - Specify additional metadata that should be returned.
 * @param {'any'|'last'} [config.destination="any"] - Returned route ends at `any` or `last` coordinate.
 * @param {Array<Distribution>} [config.distributions] - An ordered array of [`Distribution`](#distribution) objects, each of which includes a `pickup` and `dropoff` property. `pickup` and `dropoff` properties correspond to an index in the OptimizationWaypoint array.
 * @param {'geojson'|'polyline'|'polyline6'} [config.geometries="polyline"] - Format of the returned geometries.
 * @param {string} [config.language="en"] - Language of returned turn-by-turn text instructions.
 *   See options listed in [the HTTP service documentation](https://docs.mapbox.com/api/navigation/#instructions-languages).
 * @param {'simplified'|'full'|'false'} [config.overview="simplified"] - Type of returned overview geometry.
 * @param {boolean} [config.roundtrip=true] - Specifies whether the trip should complete by returning to the first location.
 * @param {'any'|'first'} [config.source="any"] - To begin the route, start either from the first coordinate or let the Optimization API choose.
 * @param {boolean} [config.steps=false] - Whether to return steps and turn-by-turn instructions.
 * @return {MapiRequest}
 */
Optimization.getOptimization = function(config) {
  v.assertShape({
    profile: v.oneOf('driving', 'driving-traffic', 'walking', 'cycling'),
    waypoints: v.required(
      v.arrayOf(
        v.shape({
          coordinates: v.required(v.coordinates),
          approach: v.oneOf('unrestricted', 'curb'),
          bearing: v.arrayOf(v.range([0, 360])),
          radius: v.oneOfType(v.number, v.equal('unlimited'))
        })
      )
    ),
    annotations: v.arrayOf(v.oneOf('duration', 'distance', 'speed')),
    geometries: v.oneOf('geojson', 'polyline', 'polyline6'),
    language: v.string,
    overview: v.oneOf('simplified', 'full', 'false'),
    roundtrip: v.boolean,
    steps: v.boolean,
    source: v.oneOf('any', 'first'),
    destination: v.oneOf('any', 'last'),
    distributions: v.arrayOf(
      v.shape({
        pickup: v.number,
        dropoff: v.number
      })
    )
  })(config);

  var path = {
    coordinates: [],
    approach: [],
    bearing: [],
    radius: [],
    distributions: []
  };

  var waypointCount = config.waypoints.length;
  if (waypointCount < 2 || waypointCount > 12) {
    throw new Error(
      'waypoints must include between 2 and 12 OptimizationWaypoints'
    );
  }

  /**
   * @typedef {Object} OptimizationWaypoint
   * @property {Coordinates} coordinates
   * @property {'unrestricted'|'curb'} [approach="unrestricted"] - Used to indicate how requested routes consider from which side of the road to approach the waypoint.
   * @property {[number, number]} [bearing] - Used to filter the road segment the waypoint will be placed on by direction and dictates the angle of approach.
   *   This option should always be used in conjunction with a `radius`. The first value is an angle clockwise from true north between 0 and 360,
   *   and the second is the range of degrees the angle can deviate by.
   * @property {number|'unlimited'} [radius] - Maximum distance in meters that the coordinate is allowed to move when snapped to a nearby road segment.
   */
  config.waypoints.forEach(function(waypoint) {
    path.coordinates.push(
      waypoint.coordinates[0] + ',' + waypoint.coordinates[1]
    );

    // join props which come in pairs
    ['bearing'].forEach(function(prop) {
      if (waypoint.hasOwnProperty(prop) && waypoint[prop] != null) {
        waypoint[prop] = waypoint[prop].join(',');
      }
    });

    ['approach', 'bearing', 'radius'].forEach(function(prop) {
      if (waypoint.hasOwnProperty(prop) && waypoint[prop] != null) {
        path[prop].push(waypoint[prop]);
      } else {
        path[prop].push('');
      }
    });
  });

  /**
   * @typedef {Object} Distribution
   * @property {number} pickup - Array index of the item containing coordinates for the pick-up location in the OptimizationWaypoint array.
   * @property {number} dropoff - Array index of the item containing coordinates for the drop-off location in the OptimizationWaypoint array.
   */
  // distributions aren't a property of OptimizationWaypoint, so join them separately
  if (config.distributions) {
    config.distributions.forEach(function(dist) {
      path.distributions.push(dist.pickup + ',' + dist.dropoff);
    });
  }

  ['approach', 'bearing', 'radius', 'distributions'].forEach(function(prop) {
    // avoid sending params which are all `;`
    if (
      path[prop].every(function(char) {
        return char === '';
      })
    ) {
      delete path[prop];
    } else {
      path[prop] = path[prop].join(';');
    }
  });

  var query = stringifyBooleans({
    geometries: config.geometries,
    language: config.language,
    overview: config.overview,
    roundtrip: config.roundtrip,
    steps: config.steps,
    source: config.source,
    destination: config.destination,
    distributions: path.distributions,
    approaches: path.approach,
    bearings: path.bearing,
    radiuses: path.radius
  });

  return this.client.createRequest({
    method: 'GET',
    path: '/optimized-trips/v1/mapbox/:profile/:coordinates',
    params: {
      profile: config.profile || 'driving',
      coordinates: path.coordinates.join(';')
    },
    query: objectClean(query)
  });
};

module.exports = createServiceFactory(Optimization);
