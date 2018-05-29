'use strict';

const v = require('../validator');

var t = function(rootcheck) {
  return function(value) {
    var messages = v.validate(rootcheck, value);
    return messages;
  };
};

describe('v.file in Node', () => {
  var check = t(v.shape({ prop: v.file }));

  test('rejects numbers', () => {
    expect(check({ prop: 4 })).toEqual(['prop', 'Filename or Readable stream']);
  });

  test('rejects booleans', () => {
    expect(check({ prop: false })).toEqual([
      'prop',
      'Filename or Readable stream'
    ]);
  });

  test('rejects object', () => {
    expect(check({ prop: { foo: 'bar' } })).toEqual([
      'prop',
      'Filename or Readable stream'
    ]);
  });

  test('rejects arrays', () => {
    expect(check({ prop: ['a', 'b'] })).toEqual([
      'prop',
      'Filename or Readable stream'
    ]);
  });

  test('accepts strings', () => {
    expect(check({ prop: 'path/to/file.txt' })).toBeUndefined();
  });

  test('accepts Readable streams', () => {
    expect(
      check({
        prop: require('fs').createReadStream(
          require('path').join(__dirname, './fixtures/foo.txt')
        )
      })
    ).toBeUndefined();
  });
});
