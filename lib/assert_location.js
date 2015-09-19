'use strict';

var assert = require('assert');

function assertLocation(location) {
  assert(typeof location.latitude === 'number' &&
    typeof location.longitude === 'number',
    'location must be an object with numeric latitude & longitude properties');
  if (location.zoom !== undefined) {
    assert(typeof location.zoom === 'number', 'zoom must be numeric');
  }
}

module.exports = assertLocation;
