'use strict';

var browserClient = require('./lib/browser/browser-client');
var mbxDatasets = require('./services/datasets');
var mbxDirections = require('./services/directions');
var mbxGeocoding = require('./services/geocoding');
var mbxGeocodingV6 = require('./services/geocoding-v6');
var mbxMapMatching = require('./services/map-matching');
var mbxMatrix = require('./services/matrix');
var mbxOptimization = require('./services/optimization');
var mbxStatic = require('./services/static');
var mbxStyles = require('./services/styles');
var mbxTilequery = require('./services/tilequery');
var mbxTilesets = require('./services/tilesets');
var mbxTokens = require('./services/tokens');
var mbxUploads = require('./services/uploads');
var mbxIsochrone = require('./services/isochrone');

function mapboxSdk(options) {
  var client = browserClient(options);

  client.datasets = mbxDatasets(client);
  client.directions = mbxDirections(client);
  client.geocoding = mbxGeocoding(client);
  client.geocodingV6 = mbxGeocodingV6(client);
  client.mapMatching = mbxMapMatching(client);
  client.matrix = mbxMatrix(client);
  client.optimization = mbxOptimization(client);
  client.static = mbxStatic(client);
  client.styles = mbxStyles(client);
  client.tilequery = mbxTilequery(client);
  client.tilesets = mbxTilesets(client);
  client.tokens = mbxTokens(client);
  client.uploads = mbxUploads(client);
  client.isochrone = mbxIsochrone(client);

  return client;
}

module.exports = mapboxSdk;
