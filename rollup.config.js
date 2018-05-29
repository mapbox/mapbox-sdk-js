/* eslint-env node */
'use strict';

var path = require('path');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
  input: path.join(__dirname, './bundle.js'),
  output: {
    file: path.join(__dirname, './umd/mapbox-sdk.js'),
    format: 'umd',
    name: 'mapboxSdk'
  },
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs()
  ]
};
