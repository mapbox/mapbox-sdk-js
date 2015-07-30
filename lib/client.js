'use strict';

var makeClient = require('./make_service');
var xtend = require('xtend/mutable');
var MapboxGeocoder = require('./services/geocoder');
var MapboxSurface = require('./services/surface');
var MapboxDirections = require('./services/directions');
var MapboxMatching = require('./services/matching');
var MapboxDatasets = require('./services/datasets');

/**
 * The JavaScript API to Mapbox services
 *
 * @class
 * @throws {Error} if accessToken is not provided
 * @param {string} accessToken a private or public access token
 * @param {Object} options additional options provided for configuration
 * @param {string} [options.endpoint=https://api.mapbox.com] location
 * of the Mapbox API pointed-to. This can be customized to point to a
 * Mapbox Atlas Server instance, or a different service, a mock,
 * or a staging endpoint. Usually you don't need to customize this.
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 */
var MapboxClient = makeClient('MapboxClient');

xtend(MapboxClient.prototype,
  MapboxGeocoder.prototype,
  MapboxSurface.prototype,
  MapboxDirections.prototype,
  MapboxMatching.prototype,
  MapboxDatasets.prototype);

module.exports = MapboxClient;
