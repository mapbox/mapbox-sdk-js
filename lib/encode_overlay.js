'use strict';

var invariant = require('../vendor/invariant'),
  invariantLocation = require('./invariant_location'),
  polyline = require('../vendor/polyline'),
  geojsonhint = require('geojsonhint/object');

/**
 * Given a list of markers, encode them for display
 * @param {Array<Object>} markers a list of markers
 * @returns {string} encoded markers
 * @private
 */
function encodeMarkers(markers) {
  return markers.map(function(marker) {
    invariantLocation(marker);
    var size = marker.size || 'l';
    var symbol = marker.symbol || 'circle';
    return 'pin-' + size + '-' + symbol + '(' +
      marker.longitude + ',' + marker.latitude + ')';
  }).join(',');
}

module.exports.encodeMarkers = encodeMarkers;

/**
 * Given a path and style, encode it for display
 * @param {Object} path an object of a path and style
 * @param {Object} path.geojson a GeoJSON LineString
 * @param {Object} [path.style={}] style parameters
 * @returns {string} encoded path as polyline
 * @private
 */
function encodePath(path) {
  invariant(geojsonhint.hint(path.geojson).length === 0, 'path overlay must be valid GeoJSON');
  invariant(path.geojson.type === 'LineString', 'path line must be a LineString');
  var encoded = polyline.fromGeoJSON(path.geojson);

  var style = '';
  if (path.style) {
    if (path.style.strokewidth !== undefined) style += '-' + path.style.strokewidth;
    if (path.style.strokecolor !== undefined) style += '+' + path.style.strokecolor;
  }
  return 'path' + style + '(' + encoded + ')';
}

module.exports.encodePath = encodePath;

/**
 * Given a GeoJSON object, encode it for a static map.
 * @param {Object} geojson a geojson object
 * @returns {string} encoded geojson as string
 * @private
 */
function encodeGeoJSON(geojson) {
  invariant(geojsonhint.hint(geojson).length === 0, 'overlay must be valid GeoJSON');
  var encoded = encodeURIComponent(JSON.stringify(geojson));
  invariant(encoded.length < 4096, 'encoded GeoJSON must be shorter than 4096 characters long');
  return 'geojson(' + encoded + ')';
}

module.exports.encodeGeoJSON = encodeGeoJSON;
