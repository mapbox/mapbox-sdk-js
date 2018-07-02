'use strict';

const fs = require('fs');
const path = require('path');
const camelcase = require('camelcase');
const mapboxSdk = require('../bundle');

describe('includes all services', () => {
  const services = fs
    .readdirSync(path.join(__dirname, '../services'))
    .filter(filename => path.extname(filename) === '.js')
    .map(filename => camelcase(path.basename(filename, '.js')));

  // Mock token lifted from parse-mapbox-token tests.
  const client = mapboxSdk({
    accessToken:
      'pk.eyJ1IjoiZmFrZXVzZXIiLCJhIjoicHBvb2xsIn0.sbihZCZJ56-fsFNKHXF8YQ'
  });

  services.forEach(service => {
    test(`includes ${service}`, () => {
      expect(client[service]).toBeTruthy();
    });
  });
});
