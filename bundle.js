'use strict';

var browserClient = require('./lib/browser/browser-client');
var datasets = require('./services/datasets');
var directions = require('./services/directions');
var styles = require('./services/styles');
var tilequery = require('./services/tilequery');
var tilesets = require('./services/tilesets');
var tokens = require('./services/tokens');

function mapboxSdk(options) {
  var client = browserClient(options);

  client.datasets = datasets(client);
  client.directions = directions(client);
  client.styles = styles(client);
  client.tilequery = tilequery(client);
  client.tilesets = tilesets(client);
  client.tokens = tokens(client);

  return client;
}

module.exports = mapboxSdk;
