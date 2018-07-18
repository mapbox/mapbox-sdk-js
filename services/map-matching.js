'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var objectClean = require('./service-helpers/object-clean');
var urlUtils = require('../lib/helpers/url-utils');
var stringifyBooleans = require('./service-helpers/stringify-booleans');

/**
 * Map Matching API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://www.mapbox.com/api-documentation/#map-matching).
 */
var MapMatching = {};

/**
 * Snap recorded location traces to roads and paths.
 *
 * @param {Object} config
 * @param {Array<MapMatchingPoint>} config.points - An ordered array of [`MapMatchingPoint`](#mapmatchingpoint)s, between 2 and 100 (inclusive).
 * @param {'driving-traffic'|'driving'|'walking'|'cycling'} [config.profile=driving] - A directions profile ID.
 * @param {Array<'duration'|'distance'|'speed'>} [config.annotations] - Specify additional metadata that should be returned.
 * @param {'geojson'|'polyline'|'polyline6'} [config.geometries="polyline"] - Format of the returned geometry.
 * @param {string} [config.language="en"] - Language of returned turn-by-turn text instructions.
 *   See [supported languages](https://www.mapbox.com/api-documentation/#instructions-languages).
 * @param {'simplified'|'full'|'false'} [config.overview="simplified"] - Type of returned overview geometry.
 * @param {boolean} [config.steps=false] - Whether to return steps and turn-by-turn instructions.
 * @param {boolean} [config.tidy=false] - Whether or not to transparently remove clusters and re-sample traces for improved map matching results.
 * @return {MapiRequest}
 */
MapMatching.getMatch = function(config) {
  v.assertShape({
    points: v.required(
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

  var pointCount = config.points.length;
  if (pointCount < 2 || pointCount > 100) {
    throw new Error('points must include between 2 and 100 MapMatchingPoints');
  }

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
   * @typedef {Object} MapMatchingPoint
   * @property {Coordinates} coordinates
   * @property {'unrestricted'|'curb'} [approach="unrestricted"] - Used to indicate how requested routes consider from which side of the road to approach a waypoint.
   * @property {number} [radius=5] - A number in meters indicating the assumed precision of the used tracking device.
   * @property {boolean} [isWaypoint=true] - Whether this coordinate is waypoint or not. The first and last coordinates will always be waypoints.
   * @property {string} [waypointName] - Custom name for the waypoint used for the arrival instruction in banners and voice instructions. Will be ignored unless `isWaypoint` is `true`.
   * @property {tring | number | Date} [timestamp] - Datetime corresponding to the coordinate.
   */
  config.points.forEach(function(obj) {
    path.coordinates.push(obj.coordinates[0] + ',' + obj.coordinates[1]);

    // isWaypoint
    if (obj.hasOwnProperty('isWaypoint') && obj.isWaypoint != null) {
      path.isWaypoint.push(obj.isWaypoint);
    } else {
      path.isWaypoint.push(true); // default value
    }

    if (obj.hasOwnProperty('timestamp') && obj.timestamp != null) {
      path.timestamp.push(Number(new Date(obj.timestamp)));
    } else {
      path.timestamp.push('');
    }

    ['approach', 'radius', 'waypointName'].forEach(function(prop) {
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

  var body = stringifyBooleans(
    objectClean({
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
    })
  );

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

module.exports = createServiceFactory(MapMatching);
