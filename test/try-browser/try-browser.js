/* eslint-disable no-console */
'use strict';

var mbxClient = require('../..');
var mbxStyles = require('../../services/styles');
var mbxTilesets = require('../../services/tilesets');
var mbxTokens = require('../../services/tokens');

window.tryServiceMethod = function(
  serviceName,
  methodName,
  config,
  accessToken
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
    tokens: mbxTokens(baseClient)
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
    .then(log, log);
};

function log(msg) {
  console.log(msg);
}
