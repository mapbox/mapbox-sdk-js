'use strict';

/**
 * Create a new object by picking properties off an existing object.
 *
 * @param {Object} source
 * @param {Array<string>} keys
 * @returns {Object}
 */
function pick(source, keys) {
  return Object.keys(source).reduce(function(result, key) {
    if (keys.indexOf(key) !== -1 && source[key] !== undefined) {
      result[key] = source[key];
    }
    return result;
  }, {});
}

module.exports = pick;
