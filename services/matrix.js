'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var pick = require('./service-helpers/pick');

/**
 * Map Matching API service.
 */
var Matrix = {};

/**
 * Returns a duration and/or distance matrix showing travel times and distances between coordinates.
 *
 * See the [Mapbox Direction Matrix API](https://www.mapbox.com/api-documentation/#matrix).
 *
 * @param {Object} config
 * @param {Array<MatrixPath>} config.matrixPath - An ordered array of object containing coordinates and related properties. The size of this array must be between 2 & 100 (inclusive).
 * @param {'driving-traffic'|'driving'|'walking'|'cycling'} [config.profile=driving]
 * @param {Array<'all'|number>} [config.sources] - Use coordinates with given index as sources.
 * @param {Array<'all'|number>} [config.destinations] - Use coordinates with given index as destinations.
 * @param {Array<'distance'|'duration'>} [config.annotations] - Whether or not to return additional metadata along the route.
 * @return {MapiRequest}
 */
Matrix.getMatrix = function(config) {
  v.assertShape({
    matrixPath: v.required(
      v.arrayOf(
        v.shape({
          coordinates: v.required(v.coordinates),
          approach: v.oneOf('unrestricted', 'curb')
        })
      )
    ),
    profile: v.oneOf('driving-traffic', 'driving', 'walking', 'cycling'),
    annotations: v.arrayOf(v.oneOf('duration', 'distance')),
    sources: v.oneOfType(v.equal('all'), v.arrayOf(v.number)),
    destinations: v.oneOfType(v.equal('all'), v.arrayOf(v.number))
  })(config);

  config.profile = config.profile || 'driving';

  var matrixPath = {
    coordinates: [],
    approach: []
  };
  /**
   * An ordered array of object with coordinates and related properties.
   * This might differ from the HTTP API as we have combined
   * all the properties that depend on the order of coordinates into
   * one object for ease of use.
   *
   * @typedef {Object} MatrixPath
   * @property {Array<number>} coordinates - An array containing (longitude, latitude).
   * @property {'unrestricted'|'curb'} [approach="unrestricted"] - Used to indicate how requested routes consider from which side of the road to approach a waypoint.
   */
  config.matrixPath.forEach(function(obj) {
    matrixPath.coordinates.push(obj.coordinates[0] + ',' + obj.coordinates[1]);

    if (obj.hasOwnProperty('approach') && obj.approach != null) {
      matrixPath.approach.push(obj.approach);
    } else {
      matrixPath.approach.push(''); // default value
    }
  });

  if (
    matrixPath.approach.every(function(value) {
      return value == '';
    })
  ) {
    delete matrixPath.approach;
  } else {
    matrixPath.approach = matrixPath.approach.join(';');
  }

  var query = {
    sources: Array.isArray(config.sources)
      ? config.sources.join(';')
      : config.sources,
    destinations: Array.isArray(config.destinations)
      ? config.destinations.join(';')
      : config.destinations,
    approaches: matrixPath.approach,
    annotations: config.annotations && config.annotations.join(',')
  };

  return this.client.createRequest({
    method: 'GET',
    path: '/directions-matrix/v1/mapbox/:profile/:coordinates',
    params: {
      profile: config.profile,
      coordinates: matrixPath.coordinates.join(';')
    },
    query: pick(query, function(_, val) {
      return val != null;
    })
  });
};

module.exports = createServiceFactory(Matrix);
