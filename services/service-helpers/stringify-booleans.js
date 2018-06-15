'use strict';

var objectMap = require('./object-map');

/**
 * Stringify all the boolean values in an object, so true becomes "true".
 *
 * @param {Object} obj
 * @returns {Object}
 */
function stringifyBoolean(obj) {
  return objectMap(obj, function(_, value) {
    return typeof value === 'boolean' ? JSON.stringify(value) : value;
  });
}

module.exports = stringifyBoolean;
