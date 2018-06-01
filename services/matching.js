'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var objectMap = require('./service-helpers/object-map');
var objectClean = require('./service-helpers/object-clean');
var urlUtils = require('../lib/helpers/url-utils');

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

  var path = {
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
    path.coordinates.push(obj.coordinates[0] + ',' + obj.coordinates[1]);

    // isWaypoint
    if (obj.hasOwnProperty('isWaypoint') && obj.isWaypoint != null) {
      path.isWaypoint.push(obj.isWaypoint);
    } else {
      path.isWaypoint.push(true); // default value
    }

    ['approach', 'radius', 'waypointName', 'timestamp'].forEach(function(prop) {
      if (obj.hasOwnProperty(prop) && obj[prop] != null) {
        path[prop].push(obj[prop]);
      } else {
        path[prop].push('');
      }
    });
  });

  ['coordinates', 'approach', 'radius', 'waypointName', 'timestamp'].forEach(
    function(prop) {
      // avoid sending params which are all `;`
      if (
        path[prop].every(function(value) {
          return value === '';
        })
      ) {
        delete path[prop];
      } else {
        path[prop] = path[prop].join(';');
      }
    }
  );

  // the api requires the first and last items to be true.
  path.isWaypoint[0] = true;
  path.isWaypoint[path.isWaypoint.length - 1] = true;

  if (
    path.isWaypoint.every(function(value) {
      return value === true;
    })
  ) {
    delete path.isWaypoint;
  } else {
    // the api requires the indexes to be sent
    path.isWaypoint = path.isWaypoint
      .map(function(val, i) {
        return val === true ? i : '';
      })
      .join(';');
  }

  var body = objectClean({
    annotations: config.annotations,
    geometries: config.geometries,
    language: config.language,
    overview: config.overview,
    steps: config.steps,
    tidy: config.tidy,
    approaches: path.approach,
    radiuses: path.radius,
    waypoints: path.isWaypoint,
    timestamps: path.timestamp,
    waypoint_names: path.waypointName,
    coordinates: path.coordinates
  });

  body = objectMap(body, function(_, value) {
    // appendQueryObject doesn't stringify booleans
    return typeof value === 'boolean' ? JSON.stringify(value) : value;
  });

  // the matching api expects a form-urlencoded
  // post request.
  return this.client.createRequest({
    method: 'POST',
    path: '/matching/v5/mapbox/:profile',
    params: {
      profile: config.profile
    },
    body: urlUtils.appendQueryObject('', body).substring(1), // need to remove the char`?`
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });
};

module.exports = createServiceFactory(Matching);
