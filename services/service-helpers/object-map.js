'use strict';

function objectMap(obj, cb) {
  return Object.keys(obj).reduce(function(result, key) {
    result[key] = cb(key, obj[key]);
    return result;
  }, {});
}

module.exports = objectMap;
