'use strict';

var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var objectClean = require('./service-helpers/object-clean');

/**
 * Map Matching API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://www.mapbox.com/api-documentation/#matrix).
 */
var Matrix = {};

/**
 * Get a duration and/or distance matrix showing travel times and distances between coordinates.
 *
 * @param {Object} config
 * @param {Array<MatrixPoint>} config.points - An ordered array of [`MatrixPoint`](#matrixpoint)s, between 2 and 100 (inclusive).
 * @param {'driving-traffic'|'driving'|'walking'|'cycling'} [config.profile=driving] - A Mapbox Directions routing profile ID.
 * @param {'all'|Array<number>} [config.sources] - Use coordinates with given index as sources.
 * @param {'all'|Array<number>} [config.destinations] - Use coordinates with given index as destinations.
 * @param {Array<'distance'|'duration'>} [config.annotations] - Used to specify resulting matrices.
 * @return {MapiRequest}
 */
Matrix.getMatrix = function(config) {
  v.assertShape({
    points: v.required(
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

  var pointCount = config.points.length;
  if (pointCount < 2 || pointCount > 100) {
    throw new Error('points must include between 2 and 100 MatrixPoints');
  }

  config.profile = config.profile || 'driving';

  var path = {
    coordinates: [],
    approach: []
  };
  /**
   * @typedef {Object} MatrixPoint
   * @property {Coordinates} coordinates - `[longitude, latitude]`
   * @property {'unrestricted'|'curb'} [approach="unrestricted"] - Used to indicate how requested routes consider from which side of the road to approach the point.
   */
  config.points.forEach(function(obj) {
    path.coordinates.push(obj.coordinates[0] + ',' + obj.coordinates[1]);

    if (obj.hasOwnProperty('approach') && obj.approach != null) {
      path.approach.push(obj.approach);
    } else {
      path.approach.push(''); // default value
    }
  });

  if (
    path.approach.every(function(value) {
      return value === '';
    })
  ) {
    delete path.approach;
  } else {
    path.approach = path.approach.join(';');
  }

  var query = {
    sources: Array.isArray(config.sources)
      ? config.sources.join(';')
      : config.sources,
    destinations: Array.isArray(config.destinations)
      ? config.destinations.join(';')
      : config.destinations,
    approaches: path.approach,
    annotations: config.annotations && config.annotations.join(',')
  };

  return this.client.createRequest({
    method: 'GET',
    path: '/directions-matrix/v1/mapbox/:profile/:coordinates',
    params: {
      profile: config.profile,
      coordinates: path.coordinates.join(';')
    },
    query: objectClean(query)
  });
};

module.exports = createServiceFactory(Matrix);
