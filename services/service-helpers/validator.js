'use strict';

var xtend = require('xtend');
var v = require('@mapbox/fusspot');

function file(value) {
  // If we're in a browser so Blob is available, the file must be that.
  // In Node, however, it could be a filepath or a pipeable (Readable) stream.
  if (typeof window !== 'undefined') {
    if (value instanceof global.Blob || value instanceof global.ArrayBuffer) {
      return;
    }
    return 'Blob or ArrayBuffer';
  }
  if (typeof value === 'string' || value.pipe !== undefined) {
    return;
  }
  return 'Filename or Readable stream';
}

function assertShape(validatorObj, apiName) {
  return v.assert(v.shape(validatorObj), apiName);
}

module.exports = xtend(v, {
  file: file,
  assertShape: assertShape
});
