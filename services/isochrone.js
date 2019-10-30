'use strict';

var v = require('./service-helpers/validator');
var objectClean = require('./service-helpers/object-clean');
var stringifyBooleans = require('./service-helpers/stringify-booleans');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Isochrone API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/navigation/#isochrone).
 */
var Isochrone = {};

/**
 * Given a location and a routing profile, retrieve up to four isochrone contours
 * @param {Object} config
 * @param {'driving'|'walking'|'cycling'} [config.profile="driving"] - 	A Mapbox Directions routing profile ID.
 * @param {Coordinates} config.coordinates - A  {longitude,latitude} coordinate pair around which to center the isochrone lines.
 * @param {Array<number>} config.minutes - The times in minutes to use for each isochrone contour. You can specify up to four contours. Times must be in increasing order. The maximum time that can be specified is 60 minutes.
 * @param {Array<string>} [config.colors] - The colors to use for each isochrone contour, specified as hex values without a leading # (for example, ff0000 for red). If this parameter is used, there must be the same number of colors as there are entries in contours_minutes. If no colors are specified, the Isochrone API will assign a default rainbow color scheme to the output.
 * @param {boolean} [config.polygons] - Specify whether to return the contours as GeoJSON polygons (true) or linestrings (false, default). When polygons=true, any contour that forms a ring is returned as a polygon.
 * @param {number} [config.denoise] - A floating point value from 0.0 to 1.0 that can be used to remove smaller contours. The default is 1.0. A value of 1.0 will only return the largest contour for a given time value. A value of 0.5 drops any contours that are less than half the area of the largest contour in the set of contours for that same time value.
 * @param {number} [config.generalize] - A positive floating point value in meters used as the tolerance for Douglas-Peucker generalization. There is no upper bound. If no value is specified in the request, the Isochrone API will choose the most optimized generalization to use for the request. Note that the generalization of contours can lead to self-intersections, as well as intersections of adjacent contours.

 * @return {MapiRequest}
 */
Isochrone.getContours = function(config) {
  v.assertShape({
    profile: v.oneOf('driving', 'walking', 'cycling'),
    coordinates: v.coordinates,
    minutes: v.arrayOf(v.number),
    colors: v.arrayOf(v.string),
    polygons: v.boolean,
    denoise: v.number,
    generalize: v.number
  })(config);

  config.profile = config.profile || 'driving';

  var minutesCount = config.minutes.length;

  if (minutesCount < 1 || minutesCount > 4) {
    throw new Error('minutes must contain between 1 and 4 contour values');
  }

  if (
    config.colors !== undefined &&
    config.minutes !== undefined &&
    config.colors.length !== config.minutes.length
  ) {
    throw new Error('colors should have the same number of entries as minutes');
  }

  if (
    !config.minutes.every(function(minute) {
      return minute <= 60;
    })
  ) {
    throw new Error('minutes must be less than 60');
  }

  if (config.generalize && config.generalize < 0) {
    throw new Error('generalize tolerance must be a positive number');
  }

  // Strip "#" from colors.
  if (config.colors) {
    config.colors = config.colors.map(function(color) {
      if (color[0] === '#') return color.substring(1);
      return color;
    });
  }

  var query = stringifyBooleans({
    contours_minutes: config.minutes.join(','),
    contours_colors: config.colors ? config.colors.join(',') : null,
    polygons: config.polygons,
    denoise: config.denoise,
    generalize: config.generalize
  });

  return this.client.createRequest({
    method: 'GET',
    path: '/isochrone/v1/mapbox/:profile/:coordinates',
    params: {
      profile: config.profile,
      coordinates: config.coordinates.join(',')
    },
    query: objectClean(query)
  });
};

module.exports = createServiceFactory(Isochrone);
