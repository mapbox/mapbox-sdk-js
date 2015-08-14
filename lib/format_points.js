'use strict';

var invariant = require('invariant');

/**
 * Format waypionts in a way that's friendly to the directions and surface
 * API: comma-separated latitude, longitude pairs with semicolons between
 * them.
 * @private
 * @param {Array<Object>} waypoints array of objects with latitude and longitude
 * properties
 * @returns {string} formatted points
 * @throws {Error} if the input is invalid
 */
function formatPoints(waypoints) {
  return waypoints.map(function(location) {
    invariant(typeof location.latitude === 'number' &&
      typeof location.longitude === 'number',
      'location must be an object with numeric latitude & longitude properties');
    return location.longitude + ',' + location.latitude;
  }).join(';');
}

module.exports = formatPoints;
