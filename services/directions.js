'use strict';

var v = require('./service-helpers/validator');
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
 * @param {Array<wayPoints>} config.wayPoints - An ordered array of `wayPoint` object. There can be between 2 and 25 wayPoints.
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
  v.validate(
    {
      profile: v.oneOf('driving-traffic', 'driving', 'walking', 'cycling'),
      wayPoints: v.arrayOf(v.plainObject).required,
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
    },
    config
  );

  config.profile = config.profile || 'driving';

  /**
   * A collection of ordered way points with optional properties.
   * This might differ from the HTTP API as we have combined
   * all the properties that depend on the order of coordinates into
   * one object for ease of use.
   *
   * @typedef {Object} wayPoints
   * @property {number} latitude
   * @property {number} longitude
   * @property {'unrestricted'|'curb'} [approach="unrestricted"] - Used to indicate how requested routes consider from which side of the road to approach a waypoint.
   * @property {Array<number>} [bearing] - Used to filter the road segment the waypoint will be placed on by direction and dictates the angle of approach.
   * @property {number|'unlimited'} [radius] - Maximum distance in meters that each coordinate is allowed to move when snapped to a nearby road segment.
   * @property {string} [wayPointName] - Custom names for waypoints used for the arrival instruction in banners and voice instructions.
   */
  config.wayPoints.forEach(function(wayPoint) {
    v.validate(
      {
        latitude: v.number.required,
        longitude: v.number.required,
        approach: v.oneOf('unrestricted', 'curb'),
        bearing: v.arrayOf(v.number),
        radius: v.oneOfType(v.number, v.oneOf('unlimited')),
        wayPointName: v.string
      },
      wayPoint
    );
  });

  var wayPoints = {
    coordinates: [],
    approach: [],
    bearing: [],
    radius: [],
    wayPointName: []
  };

  config.wayPoints.forEach(function(wayPoint) {
    wayPoints.coordinates.push(wayPoint.longitude + ',' + wayPoint.latitude);

    // join props which come in pairs
    ['bearing'].forEach(function(prop) {
      if (wayPoint.hasOwnProperty(prop) && wayPoint[prop] != null) {
        wayPoint[prop] = wayPoint[prop].join(',');
      }
    });

    ['approach', 'bearing', 'radius', 'wayPointName'].forEach(function(prop) {
      if (wayPoint.hasOwnProperty(prop) && wayPoint[prop] != null) {
        wayPoints[prop].push(wayPoint[prop]);
      } else {
        wayPoints[prop].push('');
      }
    });
  });

  ['approach', 'bearing', 'radius', 'wayPointName'].forEach(function(prop) {
    // avoid sending params which are all `;`
    if (
      wayPoints[prop].every(function(char) {
        return char == '';
      })
    ) {
      delete wayPoints[prop];
    } else {
      wayPoints[prop] = wayPoints[prop].join(';');
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
    approach: wayPoints.approach,
    bearing: wayPoints.bearing,
    radius: wayPoints.radius,
    waypoint_name: wayPoints.wayPointName
  };

  return this.client.createRequest({
    method: 'GET',
    path: '/directions/v5/:profile/:coordinates',
    params: {
      profile: config.profile,
      coordinates: wayPoints.coordinates.join(';')
    },
    query: pick(query, function(_, val) {
      return val != null;
    })
  });
};

module.exports = createServiceFactory(Directions);
