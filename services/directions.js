'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var objectClean = require('./service-helpers/object-clean');
var stringifyBooleans = require('./service-helpers/stringify-booleans');

/**
 * Directions API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://www.mapbox.com/api-documentation/navigation/#directions).
 */
var Directions = {};

/**
 * Get directions.
 *
 * Please read [the full HTTP service documentation](https://www.mapbox.com/api-documentation/navigation/#directions)
 * to understand all of the available options.
 *
 * @param {Object} config
 * @param {'driving-traffic'|'driving'|'walking'|'cycling'} [config.profile="driving"]
 * @param {Array<DirectionsWaypoint>} config.waypoints - An ordered array of [`DirectionsWaypoint`](#directionswaypoint) objects, between 2 and 25 (inclusive).
 * @param {boolean} [config.alternatives=false] - Whether to try to return alternative routes.
 * @param {Array<'duration'|'distance'|'speed'|'congestion'>} [config.annotations] - Specify additional metadata that should be returned.
 * @param {boolean} [config.bannerInstructions=false] - Should be used in conjunction with `steps`.
 * @param {boolean} [config.continueStraight] - Sets the allowed direction of travel when departing intermediate waypoints.
 * @param {string} [config.exclude] - Exclude certain road types from routing. See HTTP service documentation for options.
 * @param {'geojson'|'polyline'|'polyline6'} [config.geometries="polyline"] - Format of the returned geometry.
 * @param {string} [config.language="en"] - Language of returned turn-by-turn text instructions.
 *   See options listed in [the HTTP service documentation](https://www.mapbox.com/api-documentation/navigation/#instructions-languages).
 * @param {'simplified'|'full'|'false'} [config.overview="simplified"] - Type of returned overview geometry.
 * @param {boolean} [config.roundaboutExits=false] - Emit insbtructions at roundabout exits.
 * @param {boolean} [config.steps=false] - Whether to return steps and turn-by-turn instructions.
 * @param {boolean} [config.voiceInstructions=false] - Whether or not to return SSML marked-up text for voice guidance along the route.
 * @param {'imperial'|'metric'} [config.voiceUnits="imperial"] - Which type of units to return in the text for voice instructions.
 * @return {MapiRequest}
 *
 * @example
 * directionsClient.getDirections({
 *   profile: 'driving-traffic',
 *   waypoints: [
 *     {
 *       coordinates: [13.4301, 52.5109],
 *       approach: 'unrestricted'
 *     },
 *     {
 *       coordinates: [13.4265, 52.508]
 *     },
 *     {
 *       coordinates: [13.4194, 52.5072],
 *       bearing: [100, 60]
 *     }
 *   ]
 * })
 *   .send()
 *   .then(response => {
 *     const directions = response.body;
 *   });
 */
Directions.getDirections = function(config) {
  v.assertShape({
    profile: v.oneOf('driving-traffic', 'driving', 'walking', 'cycling'),
    waypoints: v.required(
      v.arrayOf(
        v.shape({
          coordinates: v.required(v.coordinates),
          approach: v.oneOf('unrestricted', 'curb'),
          bearing: v.arrayOf(v.range([0, 360])),
          radius: v.oneOfType(v.number, v.equal('unlimited')),
          waypointName: v.string
        })
      )
    ),
    alternatives: v.boolean,
    annotations: v.arrayOf(
      v.oneOf('duration', 'distance', 'speed', 'congestion')
    ),
    bannerInstructions: v.boolean,
    continueStraight: v.boolean,
    exclude: v.string,
    geometries: v.string,
    language: v.string,
    overview: v.string,
    roundaboutExits: v.boolean,
    steps: v.boolean,
    voiceInstructions: v.boolean,
    voiceUnits: v.string
  })(config);

  config.profile = config.profile || 'driving';

  var path = {
    coordinates: [],
    approach: [],
    bearing: [],
    radius: [],
    waypointName: []
  };

  var waypointCount = config.waypoints.length;
  if (waypointCount < 2 || waypointCount > 25) {
    throw new Error(
      'waypoints must include between 2 and 25 DirectionsWaypoints'
    );
  }

  /**
   * @typedef {Object} DirectionsWaypoint
   * @property {Coordinates} coordinates
   * @property {'unrestricted'|'curb'} [approach="unrestricted"] - Used to indicate how requested routes consider from which side of the road to approach the waypoint.
   * @property {[number, number]} [bearing] - Used to filter the road segment the waypoint will be placed on by direction and dictates the angle of approach.
   *   This option should always be used in conjunction with a `radius`. The first value is an angle clockwise from true north between 0 and 360,
   *   and the second is the range of degrees the angle can deviate by.
   * @property {number|'unlimited'} [radius] - Maximum distance in meters that the coordinate is allowed to move when snapped to a nearby road segment.
   * @property {string} [waypointName] - Custom name for the waypoint used for the arrival instruction in banners and voice instructions.
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

    ['approach', 'bearing', 'radius', 'waypointName'].forEach(function(prop) {
      if (waypoint.hasOwnProperty(prop) && waypoint[prop] != null) {
        path[prop].push(waypoint[prop]);
      } else {
        path[prop].push('');
      }
    });
  });

  ['approach', 'bearing', 'radius', 'waypointName'].forEach(function(prop) {
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
    alternatives: config.alternatives,
    annotations: config.annotations,
    banner_instructions: config.bannerInstructions,
    continue_straight: config.continueStraight,
    exclude: config.exclude,
    geometries: config.geometries,
    language: config.language,
    overview: config.overview,
    roundabout_exits: config.roundaboutExits,
    steps: config.steps,
    voice_instructions: config.voiceInstructions,
    voice_units: config.voiceUnits,
    approaches: path.approach,
    bearings: path.bearing,
    radiuses: path.radius,
    waypoint_names: path.waypointName
  });

  return this.client.createRequest({
    method: 'GET',
    path: '/directions/v5/mapbox/:profile/:coordinates',
    params: {
      profile: config.profile,
      coordinates: path.coordinates.join(';')
    },
    query: objectClean(query)
  });
};

module.exports = createServiceFactory(Directions);
