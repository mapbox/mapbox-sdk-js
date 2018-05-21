'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');

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
 * @param {'driving-traffic'|'driving'|'walking'|'cycling'} [config.profile=driving]
 * @param {Array.<Object>} config.way_points - An ordered array of objects with `latitude`
 * and `longitude` properties that represent points to visit and optional `approach`, `bearing`, `radius` & `waypoint_name`,
 * see the [Mapbox Directions API](https://www.mapbox.com/api-documentation/#retrieve-directions) for details.
 * There can be between 2 and 25 coordinates.
 * @param {string} [config.alternatives=false]
 * @param {Array.<string>} [config.annotations]
 * @param {boolean} [config.banner_instructions=false]
 * @param {boolean} [config.continue_straight]
 * @param {string} [config.exclude]
 * @param {string} [config.geometries=polyline]
 * @param {string} [config.language=en]
 * @param {string} [config.overview=simplified]
 * @param {boolean} [config.roundabout_exits=false]
 * @param {boolean} [config.steps=false]
 * @param {boolean} [config.voice_instructions=false]
 * @param {string} [config.voice_units=imperial]
 * @return {MapiRequest}
 */
Directions.getDirections = function(config) {
  config.profile = config.profile || 'driving';

  v.validate(
    {
      profile: v.string,
      way_points: v.arrayOfObjects.required,
      alternatives: v.boolean,
      annotations: v.arrayOfStrings,
      banner_instructions: v.boolean,
      continue_straight: v.boolean,
      exclude: v.string,
      geometries: v.string,
      language: v.string,
      overview: v.string,
      roundabout_exits: v.boolean,
      steps: v.boolean,
      voice_instructions: v.boolean,
      voice_units: v.string
    },
    config
  );

  config.way_points.forEach(function(wayPoint) {
    v.validate(
      {
        latitude: v.number.required,
        longitude: v.number.required,
        approach: v.string,
        bearing: v.arrayOf(v.number),
        radius: v.oneOf([v.number, v.string]),
        waypoint_name: v.string
      },
      wayPoint
    );
  });

  var wayPoints = {
    coordinates: [],
    approach: [],
    bearing: [],
    radius: [],
    waypoint_name: []
  };

  config.way_points.forEach(function(wayPoint) {
    wayPoints.coordinates.push(wayPoint.longitude + ',' + wayPoint.latitude);

    // join props which come in pairs
    ['bearing'].forEach(function(prop) {
      if (wayPoint.hasOwnProperty(prop) && wayPoint[prop] != null) {
        wayPoint[prop] = wayPoint[prop].join(',');
      }
    });

    ['approach', 'bearing', 'radius', 'waypoint_name'].forEach(function(prop) {
      if (wayPoint.hasOwnProperty(prop) && wayPoint[prop] != null) {
        wayPoints[prop].push(wayPoint[prop]);
      } else {
        wayPoints[prop].push('');
      }
    });
  });

  ['approach', 'bearing', 'radius', 'waypoint_name'].forEach(function(prop) {
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
    banner_instructions: config.banner_instructions,
    continue_straight: config.continue_straight,
    exclude: config.exclude,
    geometries: config.geometries,
    language: config.language,
    overview: config.overview,
    roundabout_exits: config.roundabout_exits,
    steps: config.steps,
    voice_instructions: config.voice_instructions,
    voice_units: config.voice_units,

    approach: wayPoints.approach,
    bearing: wayPoints.bearing,
    radius: wayPoints.radius,
    waypoint_name: wayPoints.waypoint_name
  };

  // remove null/undefined keys
  Object.keys(query).forEach(function(key) {
    if (query[key] == null) {
      delete query[key];
    }
  });

  return this.client.createRequest({
    method: 'GET',
    path: '/directions/v5/:profile/:coordinates',
    params: {
      profile: config.profile,
      coordinates: wayPoints.coordinates.join(';')
    },
    query: query
  });
};

module.exports = createServiceFactory(Directions);
