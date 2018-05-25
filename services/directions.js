'use strict';

var v = require('./service-helpers/validator').v;
var createServiceFactory = require('./service-helpers/create-service-factory');
var pick = require('./service-helpers/pick');

/**
 * Directions API service.
 */
var Directions = {};

/**
 * Get directions.
 *
 * See the [Mapbox Directions API](https://www.mapbox.com/api-documentation/#directions).
 *
 * @param {Object} config
 * @param {'driving-traffic'|'driving'|'walking'|'cycling'} [config.profile="driving"]
 * @param {Array<waypoints>} config.waypoints - An ordered array of `waypoint` object. There can be between 2 and 25 waypoints.
 * @param {boolean} [config.alternatives=false] - Whether to try to return alternative routes.
 * @param {Array<'duration'|'distance'|'speed'|'congestion'>} [config.annotations] - Whether or not to return additional metadata along the route.
 * @param {boolean} [config.bannerInstructions=false] -  Should be used in conjunction with `steps`.
 * @param {boolean} [config.continueStraight] - Sets the allowed direction of travel when departing intermediate waypoints.
 * @param {string} [config.exclude] - Exclude certain road types from routing.
 * @param {'geojson'|'polyline'|'polyline6'} [config.geometries="polyline"] - Format of the returned geometry.
 * @param {string} [config.language="en"] - Language of returned turn-by-turn text instructions.
 * @param {'simplified'|'full'|'false'} [config.overview="simplified"] - Type of returned overview geometry.
 * @param {boolean} [config.roundaboutExits=false] - Emit instructions at roundabout exits.
 * @param {boolean} [config.steps=false] - Whether to return steps and turn-by-turn instructions.
 * @param {boolean} [config.voiceInstructions=false] - Whether or not to return SSML marked-up text for voice guidance along the route.
 * @param {'imperial'|'metric'} [config.voiceUnits="imperial"] - Which type of units to return in the text for voice instructions.
 * @return {MapiRequest}
 */
Directions.getDirections = function(config) {
  v.warn(
    v.shapeOf({
      profile: v.oneOf('driving-traffic', 'driving', 'walking', 'cycling'),
      waypoints: v.required(
        v.arrayOf(
          v.shapeOf({
            coordinates: v.required(v.coordinates),
            approach: v.oneOf('unrestricted', 'curb'),
            bearing: v.arrayOf(v.number),
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
    })
  )(config);

  config.profile = config.profile || 'driving';

  var waypoints = {
    coordinates: [],
    approach: [],
    bearing: [],
    radius: [],
    waypointName: []
  };

  /**
   * A collection of ordered way points with optional properties.
   * This might differ from the HTTP API as we have combined
   * all the properties that depend on the order of coordinates into
   * one object for ease of use.
   *
   * @typedef {Object} waypoints
   * @property {Array<number>} coordinates - An array containing pair of longitude, latitude.
   * @property {'unrestricted'|'curb'} [approach="unrestricted"] - Used to indicate how requested routes consider from which side of the road to approach a waypoint.
   * @property {number|'unlimited'} [radius] - Maximum distance in meters that each coordinate is allowed to move when snapped to a nearby road segment.
   * @property {string} [waypointName] - Custom names for waypoints used for the arrival instruction in banners and voice instructions.
   */
  config.waypoints.forEach(function(waypoint) {
    waypoints.coordinates.push(
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
        waypoints[prop].push(waypoint[prop]);
      } else {
        waypoints[prop].push('');
      }
    });
  });

  ['approach', 'bearing', 'radius', 'waypointName'].forEach(function(prop) {
    // avoid sending params which are all `;`
    if (
      waypoints[prop].every(function(char) {
        return char == '';
      })
    ) {
      delete waypoints[prop];
    } else {
      waypoints[prop] = waypoints[prop].join(';');
    }
  });

  var query = {
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
    approaches: waypoints.approach,
    bearings: waypoints.bearing,
    radiuses: waypoints.radius,
    waypoint_names: waypoints.waypointName
  };

  return this.client.createRequest({
    method: 'GET',
    path: '/directions/v5/mapbox/:profile/:coordinates',
    params: {
      profile: config.profile,
      coordinates: waypoints.coordinates.join(';')
    },
    query: pick(query, function(_, val) {
      return val != null;
    })
  });
};

module.exports = createServiceFactory(Directions);
