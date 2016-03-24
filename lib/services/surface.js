'use strict';

var invariant = require('../../vendor/invariant'),
  formatPoints = require('../format_points'),
  makeService = require('../make_service'),
  constants = require('../constants');

var MapboxSurface = makeService('MapboxSurface');

/**
 * Given a list of locations, retrieve vector tiles, find the nearest
 * spatial features, extract their data values, and then absolute values and
 * optionally interpolated values in-between, if the interpolate option is specified.
 *
 * Consult the [Surface API](https://www.mapbox.com/developers/api/surface/)
 * for more documentation.
 *
 * @param {string} mapid a Mapbox mapid containing vector tiles against
 * which we'll query
 * @param {string} layer layer within the given `mapid` for which to pull
 * data
 * @param {Array<string>} fields layer within the given `mapid` for which to pull
 * data
 * @param {Array<Object>|string} path either an encoded polyline,
 * provided as a string, or an array of objects with longitude and latitude
 * properties, similar to waypoints.
 * @param {Object} [options={}] additional options meant to tune
 * the request
 * @param {string} [options.geojson=false] whether to return data as a
 * GeoJSON point
 * @param {string} [options.zoom=maximum] zoom level at which features
 * are queried
 * @param {boolean} [options.interpolate=true] Whether to interpolate
 * between matches in the feature collection.
 * @param {Function} callback called with (err, results)
 * @memberof MapboxClient
 * @returns {undefined} nothing, calls callback
 * @example
 * var mapboxClient = new MapboxClient('ACCESSTOKEN');
 */
MapboxSurface.prototype.surface = function(mapid, layer, fields, path, options, callback) {

  // permit the options argument to be omitted
  if (callback === undefined && typeof options === 'function') {
    callback = options;
    options = {};
  }

  // typecheck arguments
  invariant(typeof mapid === 'string', 'mapid must be a string');
  invariant(typeof layer === 'string', 'layer must be a string');
  invariant(Array.isArray(fields), 'fields must be an array of strings');
  invariant(Array.isArray(path) || typeof path === 'string', 'path must be an array of objects or a string');
  invariant(typeof options === 'object', 'options must be an object');

  var interpolate = true,
    geojson = false;

  if (options.interpolate !== undefined) {
    invariant(typeof options.interpolate === 'boolean', 'interpolate must be a boolean');
    interpolate = options.interpolate;
  }

  if (options.geojson !== undefined) {
    invariant(typeof options.geojson === 'boolean', 'geojson option must be boolean');
    geojson = options.geojson;
  }

  var surfaceOptions = {
    geojson: geojson,
    layer: layer,
    mapid: mapid,
    fields: fields.join(','),
    interpolate: interpolate
  };

  if (Array.isArray(path)) {
    surfaceOptions.points = formatPoints(path);
  } else {
    surfaceOptions.encoded_polyline = path;
  }

  if (options.zoom !== undefined) {
    invariant(typeof options.zoom === 'number', 'zoom must be a number');
    surfaceOptions.z = options.zoom;
  }

  return this.client({
    path: constants.API_SURFACE,
    params: surfaceOptions,
    callback: callback
  }).entity();
};

module.exports = MapboxSurface;
