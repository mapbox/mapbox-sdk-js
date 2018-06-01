'use strict';

var pick = require('./pick');

function objectClean(obj) {
  return pick(obj, function(_, val) {
    return val != null;
  });
}

module.exports = objectClean;
