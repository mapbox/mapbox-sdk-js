#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

const meow = require('meow');
const mbxClient = require('..');
const mbxDatasets = require('../services/datasets');
const mbxDirections = require('../services/directions');
const mbxGeocoding = require('../services/geocoding');
const mbxGeocodingV6 = require('../services/geocoding-v6');
const mbxMapMatching = require('../services/map-matching');
const mbxMatrix = require('../services/matrix');
const mbxStyles = require('../services/styles');
const mbxTilequery = require('../services/tilequery');
const mbxTilesets = require('../services/tilesets');
const mbxTokens = require('../services/tokens');
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
  datasets: mbxDatasets(baseClient),
  directions: mbxDirections(baseClient),
  geocoding: mbxGeocoding(baseClient),
  geocodingV6: mbxGeocodingV6(baseClient),
  matching: mbxMapMatching(baseClient),
  matrix: mbxMatrix(baseClient),
  styles: mbxStyles(baseClient),
  tilequery: mbxTilequery(baseClient),
  tilesets: mbxTilesets(baseClient),
  tokens: mbxTokens(baseClient),
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
