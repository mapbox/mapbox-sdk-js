'use strict';

var invariant = require('invariant');

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
function MapboxClient(accessToken) {
  invariant(typeof accessToken === 'string',
    'accessToken required to instantiate MapboxClient');

  this.accessToken = accessToken;

  this.geocoder = new MapboxGeocoder(accessToken);
  this.surface = new MapboxSurface(accessToken);
  this.matching = new MapboxMatching(accessToken);
  this.directions = new MapboxDirections(accessToken);

}

module.exports = MapboxClient;
