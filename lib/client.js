'use strict';

var makeClient = require('./make_service');
var xtend = require('xtend/mutable');
var MapboxGeocoder = require('./services/geocoder');
var MapboxSurface = require('./services/surface');
var MapboxDirections = require('./services/directions');
var MapboxMatching = require('./services/matching');

/**
 * The JavaScript API to Mapbox services
 *
 * @class
 * @throws {Error} if accessToken is not provided
 * @param {string} accessToken a private or public access token
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 */
var MapboxClient = makeClient('MapboxClient');

xtend(MapboxClient.prototype,
  MapboxGeocoder.prototype,
  MapboxSurface.prototype,
  MapboxDirections.prototype,
  MapboxMatching.prototype);

module.exports = MapboxClient;
