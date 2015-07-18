'use strict';

var invariant = require('invariant');

function formatPoints(waypoints) {
  return waypoints.map(function(location) {
    invariant(typeof location.latitude === 'number' &&
      typeof location.longitude === 'number',
      'location must be an object with numeric latitude & longitude properties');
    return location.longitude + ',' + location.latitude;
  }).join(';');
}

module.exports = formatPoints;
