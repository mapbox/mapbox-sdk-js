/* eslint-disable no-console */
'use strict';

var mbxClient = require('../..');
var mbxStyles = require('../../services/styles');
var mbxTilesets = require('../../services/tilesets');
var mbxTokens = require('../../services/tokens');
var mbxDatasets = require('../../services/datasets');
var mbxTilequery = require('../../services/tilequery');
var mbxDirections = require('../../services/directions');
var mbxMapMatching = require('../../services/map-matching');
var mbxMatrix = require('../../services/matrix');
var mbxUploads = require('../../services/uploads');

window.tryServiceMethod = function(
  serviceName,
  methodName,
  config,
  accessToken,
  callback
) {
  config = config || {};
  accessToken = accessToken || window.MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('ERROR: Could not find an access token');
  }

  if (!serviceName || !methodName) {
    throw new Error('ERROR: You must provide a service and method');
  }

  var baseClient = mbxClient({ accessToken: accessToken });
  var services = {
    styles: mbxStyles(baseClient),
    tilesets: mbxTilesets(baseClient),
    tokens: mbxTokens(baseClient),
    datasets: mbxDatasets(baseClient),
    tilequery: mbxTilequery(baseClient),
    directions: mbxDirections(baseClient),
    mapMatching: mbxMapMatching(baseClient),
    matrix: mbxMatrix(baseClient),
    uploads: mbxUploads(baseClient)
  };

  var service = services[serviceName];
  if (!service) {
    throw new Error('Unknown service "' + serviceName + '"');
  }

  var method = service[methodName];
  if (!method) {
    throw new Error(
      'Unknown method "' + methodName + '" for service "' + serviceName + '"'
    );
  }

  service[methodName](config)
    .send()
    .then(
      function(response) {
        console.log(response);
        if (callback) callback(response);
      },
      function(error) {
        console.error(error);
      }
    );
};
