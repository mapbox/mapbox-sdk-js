'use strict';

var invariant = require('../vendor/invariant');

/**
 * Given an object that should be a location, ensure that it has
 * valid numeric longitude & latitude properties
 *
 * @param {Object} location object with longitude and latitude values
 * @throws {AssertError} if the object is not a valid location
 * @returns {undefined} nothing
 * @private
 */
function invariantLocation(location) {
  invariant(typeof location.latitude === 'number' &&
    typeof location.longitude === 'number',
    'location must be an object with numeric latitude & longitude properties');
  if (location.zoom !== undefined) {
    invariant(typeof location.zoom === 'number', 'zoom must be numeric');
  }
}

module.exports = invariantLocation;
