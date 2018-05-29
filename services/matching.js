'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var pick = require('./service-helpers/pick');

/**
 * Map Matching API service.
 */
var Matching = {};

/**
 * Snap recorded location traces to roads and paths
 *
 * See the [Mapbox Map Matching API](https://www.mapbox.com/api-documentation/#map-matching).
 *
 * @param {Object} config
 * @param {Array<MatchPath>} config.matchPath - An ordered array of object containing coordinates and related properties. The size of this array must be between 2 & 100 (inclusive).
 * @param {'driving-traffic'|'driving'|'walking'|'cycling'} [config.profile=driving]
 * @param {Array<'duration'|'distance'|'speed'>} [config.annotations] - Whether or not to return additional metadata along the route.
 * @param {'geojson'|'polyline'|'polyline6'} [config.geometries="polyline"] - Format of the returned geometry.
 * @param {string} [config.language="en"] - Language of returned turn-by-turn text instructions.
 * @param {'simplified'|'full'|'false'} [config.overview="simplified"] - Type of returned overview geometry.
 * @param {boolean} [config.steps=false] - Whether to return steps and turn-by-turn instructions.
 * @param {boolean} [config.tidy=false] - Whether or not to transparently remove clusters and re-sample traces for improved map matching results.
 * @return {MapiRequest}
 */
Matching.getMatching = function(config) {
  v.assertShape({
    matchPath: v.required(
      v.arrayOf(
        v.shape({
          coordinates: v.required(v.coordinates),
          approach: v.oneOf('unrestricted', 'curb'),
          radius: v.range([0, 50]),
          isWaypoint: v.boolean,
          waypointName: v.string,
          timestamp: v.date
        })
      )
    ),
    profile: v.oneOf('driving-traffic', 'driving', 'walking', 'cycling'),
    annotations: v.arrayOf(v.oneOf('duration', 'distance', 'speed')),
    geometries: v.oneOf('geojson', 'polyline', 'polyline6'),
    language: v.string,
    overview: v.oneOf('full', 'simplified', 'false'),
    steps: v.boolean,
    tidy: v.boolean
  })(config);

  config.profile = config.profile || 'driving';

  var matchPath = {
    coordinates: [],
    approach: [],
    radius: [],
    isWaypoint: [],
    waypointName: [],
    timestamp: []
  };

  /**
   * An ordered array of object with coordinates and related properties.
   * This might differ from the HTTP API as we have combined
   * all the properties that depend on the order of coordinates into
   * one object for ease of use.
   *
   * @typedef {Object} MatchPath
   * @property {Array<number>} coordinates - An array containing (longitude, latitude).
   * @property {'unrestricted'|'curb'} [approach="unrestricted"] - Used to indicate how requested routes consider from which side of the road to approach a waypoint.
   * @property {number} [radius=5] - A number in meters indicating the assumed precision of the used tracking device.
   * @property {boolean} [isWaypoint=true] - Whether this coordinate is waypoint or not. Note! the first and last coordinates will always have to be true.
   * @property {string} [waypointName] - Custom names for waypoint used for the arrival instruction in banners and voice instructions.
   * @property {date} [timestamp] - Unix timestamp corresponding the coordinate.
   */
  config.matchPath.forEach(function(obj) {
    matchPath.coordinates.push(obj.coordinates[0] + ',' + obj.coordinates[1]);

    // isWaypoint
    if (obj.hasOwnProperty('isWaypoint') && obj.isWaypoint != null) {
      matchPath.isWaypoint.push(obj.isWaypoint);
    } else {
      matchPath.isWaypoint.push(true); // default value
    }

    ['approach', 'radius', 'waypointName', 'timestamp'].forEach(function(prop) {
      if (obj.hasOwnProperty(prop) && obj[prop] != null) {
        matchPath[prop].push(obj[prop]);
      } else {
        matchPath[prop].push('');
      }
    });
  });

  ['coordinates', 'approach', 'radius', 'waypointName', 'timestamp'].forEach(
    function(prop) {
      // avoid sending params which are all `;`
      if (
        matchPath[prop].every(function(value) {
          return value == '';
        })
      ) {
        delete matchPath[prop];
      } else {
        matchPath[prop] = matchPath[prop].join(';');
      }
    }
  );

  // the api requires the first and last items to be true.
  matchPath.isWaypoint[0] = true;
  matchPath.isWaypoint[matchPath.isWaypoint.length - 1] = true;

  if (
    matchPath.isWaypoint.every(function(value) {
      return value == true;
    })
  ) {
    delete matchPath.isWaypoint;
  } else {
    // the api requires the indexes to be sent
    matchPath.isWaypoint = matchPath.isWaypoint
      .map(function(val, i) {
        return val == true ? i : '';
      })
      .join(';');
  }

  var query = {
    annotations: config.annotations,
    geometries: config.geometries,
    language: config.language,
    overview: config.overview,
    steps: config.steps,
    tidy: config.tidy,
    approaches: matchPath.approach,
    radiuses: matchPath.radius,
    waypoints: matchPath.isWaypoint,
    timestamps: matchPath.timestamp,
    waypoint_names: matchPath.waypointName
  };

  return this.client.createRequest({
    method: 'GET',
    path: '/matching/v5/mapbox/:profile/:coordinates.json',
    params: {
      profile: config.profile,
      coordinates: matchPath.coordinates
    },
    query: pick(query, function(_, val) {
      return val != null;
    })
  });
};

module.exports = createServiceFactory(Matching);
