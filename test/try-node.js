#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

const meow = require('meow');
const mbxClient = require('..');
const mbxStyles = require('../services/styles');
const mbxTilesets = require('../services/tilesets');
const mbxTokens = require('../services/tokens');
const mbxDatasets = require('../services/datasets');
const mbxTilequery = require('../services/tilequery');
const mbxGeocoding = require('../services/geocoding');
const mbxDirections = require('../services/directions');
const mbxMapMatching = require('../services/map-matching');
const mbxMatrix = require('../services/matrix');
const mbxUploads = require('../services/uploads');

const description = 'FOR TESTING ONLY! Try out the mapbox-sdk.';
const help = `
  Usage
    test/try-node.js <service> <method> <config> [options]

    Set your access token with the env variable MAPBOX_ACCESS_TOKEN
    or the option --access-token

  Options
    --access-token    The access token you want to use.
                      Can also be set as the env variable
                      MAPBOX_ACCESS_TOKEN.

  Example
    test/try-node.js styles createStyle '{ "styleId": "cjgsq4lcv000r2sp56iiah07e" }'
`;
const cli = meow({
  description,
  help,
  flags: {
    accessToken: { type: 'string' }
  }
});

const accessToken = cli.flags.accessToken || process.env.MAPBOX_ACCESS_TOKEN;
const serviceName = cli.input[0];
const methodName = cli.input[1];
const rawConfig = cli.input[2] || '{}';

if (!accessToken) {
  console.log('ERROR: Could not find an access token');
  cli.showHelp();
}

if (!serviceName || !methodName) {
  console.log('ERROR: You must provide a service and method');
  cli.showHelp();
}

const baseClient = mbxClient({ accessToken });
const services = {
  styles: mbxStyles(baseClient),
  tilesets: mbxTilesets(baseClient),
  tokens: mbxTokens(baseClient),
  datasets: mbxDatasets(baseClient),
  tilequery: mbxTilequery(baseClient),
  geocoding: mbxGeocoding(baseClient),
  directions: mbxDirections(baseClient),
  matching: mbxMapMatching(baseClient),
  matrix: mbxMatrix(baseClient),
  uploads: mbxUploads(baseClient)
};

const service = services[serviceName];
if (!service) {
  throw new Error(`Unknown service "${serviceName}"`);
}

const method = service[methodName];
if (!method) {
  throw new Error(
    `Unknown method "${methodName}" for service "${serviceName}"`
  );
}

const config = JSON.parse(rawConfig);

service[methodName](config)
  .send()
  .then(
    response => {
      console.log(response);
    },
    error => {
      console.log(error);
    }
  );
