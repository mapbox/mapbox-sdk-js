/**
 * @jest-environment jsdom
 */
'use strict';

const v = require('../validator');

var t = function(rootcheck) {
  return function(value) {
    var messages = v.validate(rootcheck, value);
    return messages;
  };
};

var req = v.required;

describe('v.file in the browser', () => {
  const check = t(v.shape({ prop: req(v.file) }));

  test('rejects strings', () => {
    expect(check({ prop: 'path/to/file.txt' })).toEqual([
      'prop',
      'Blob or ArrayBuffer'
    ]);
  });

  test('rejects numbers', () => {
    expect(check({ prop: 4 })).toEqual(['prop', 'Blob or ArrayBuffer']);
  });
  test('rejects booleans', () => {
    expect(check({ prop: false })).toEqual(['prop', 'Blob or ArrayBuffer']);
  });
  test('rejects objects', () => {
    expect(check({ prop: {} })).toEqual(['prop', 'Blob or ArrayBuffer']);
  });
  test('rejects arrays', () => {
    expect(check({ prop: [] })).toEqual(['prop', 'Blob or ArrayBuffer']);
  });

  test('accepts Blobs', () => {
    expect(check({ prop: new global.Blob(['blobbbbb']) })).toBeUndefined();
  });
  test('accepts ArrayBuffers', () => {
    expect(check({ prop: new global.ArrayBuffer(3) })).toBeUndefined();
  });
});
