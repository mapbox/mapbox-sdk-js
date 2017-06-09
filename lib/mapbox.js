'use strict';

var makeClient = require('./make_service');
var xtend = require('../vendor/xtend').extendMutable;
var getUser = require('./get_user');
var MapboxGeocoding = require('./services/geocoding');
var MapboxSurface = require('./services/surface');
var MapboxDirections = require('./services/directions');
var MapboxUploads = require('./services/uploads');
var MapboxMatching = require('./services/matching');
var MapboxDatasets = require('./services/datasets');
var MapboxMatrix = require('./services/matrix');
var MapboxTilestats = require('./services/tilestats');
var MapboxStyles = require('./services/styles');
var MapboxStatic = require('./services/static');
var MapboxTilesets = require('./services/tilesets');
var MapboxTokens = require('./services/tokens');


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
 * @param {string} [options.account] account id to use for api
 * requests. If not is specified, the account defaults to the owner
 * of the provided accessToken.
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 */
var MapboxClient = makeClient('MapboxClient');

// Combine all client APIs into one API for when people require()
// the main mapbox-sdk-js library.
xtend(
  MapboxClient.prototype,
  MapboxGeocoding.prototype,
  MapboxSurface.prototype,
  MapboxDirections.prototype,
  MapboxMatrix.prototype,
  MapboxMatching.prototype,
  MapboxDatasets.prototype,
  MapboxUploads.prototype,
  MapboxTilestats.prototype,
  MapboxStyles.prototype,
  MapboxStatic.prototype,
  MapboxTilesets.prototype,
  MapboxTokens.prototype
);

MapboxClient.getUser = getUser;

module.exports = MapboxClient;
