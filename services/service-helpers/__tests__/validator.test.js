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

describe('v.date', () => {
  var check = t(v.date);

  test('rejects values that cannot be passed to the Date constructor to create a valid date', () => {
    expect(check(true)).toEqual(['date']);
    expect(check('egg sandwich')).toEqual(['date']);
    expect(check({ one: 1, two: 2 })).toEqual(['date']);
    expect(check(() => {})).toEqual(['date']);
    // Make the Date constructor error.
    jest.spyOn(global, 'Date').mockImplementationOnce(() => {
      throw new Error();
    });
    expect(check(1534285808537)).toEqual(['date']);
  });

  test('accepts values that can be passed to the Date constructor to create a valid date', () => {
    expect(check(new Date())).toBeUndefined();
    expect(check('2018-03-03')).toBeUndefined();
    expect(check('Tue Aug 14 2018 15:29:53 GMT-0700 (MST)')).toBeUndefined();
    expect(check(1534285808537)).toBeUndefined();
  });
});
