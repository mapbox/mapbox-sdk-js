'use strict';

const v = require('../validator2');

describe('string', () => {
  describe('outside object', () => {
    test('success', () => {
      expect(() => v.validate(v.string, 'aa')).not.toThrow();
    });
    test('failure', () => {
      expect(() => v.validate(v.string, 7)).toThrow('expected a string');
    });
  });

  describe('inside object', () => {
    test('success', () => {
      expect(() => v.validate({ foo: v.string }, { foo: 'bb' })).not.toThrow();
    });
    test('failure', () => {
      expect(() => v.validate({ foo: v.string }, { foo: 7 })).toThrow(
        'foo must be a string'
      );
    });
  });

  describe('required', () => {
    test('success', () => {
      expect(() =>
        v.validate({ foo: v.required(v.string) }, { foo: 'bb' })
      ).not.toThrow();
    });
    test('failure', () => {
      expect(() => v.validate({ foo: v.required(v.string) }, {})).toThrow(
        'foo is required'
      );
    });
  });
});

describe('range', () => {
  test('success', () => {
    expect(() => {
      v.validate(v.range(1, 5), 4);
    }).not.toThrow();
    expect(() => {
      v.validate(v.range(1, 5), 2.33);
    }).not.toThrow();
  });
  test('failure', () => {
    expect(() => {
      v.validate(v.range(1, 5), 'foo');
    }).toThrow('expected a number between 1 and 5, inclusive');
    expect(() => {
      v.validate(v.range(1, 5), 6);
    }).toThrow('expected a number between 1 and 5, inclusive');
    expect(() => {
      v.validate(v.range(1, 5), -2);
    }).toThrow('expected a number between 1 and 5, inclusive');
  });
});

describe('coordinates', () => {
  test('success', () => {
    expect(() => {
      v.validate(v.coordinates, [10, 11]);
    }).not.toThrow();
    expect(() => {
      v.validate(v.coordinates, [-90, -83]);
    }).not.toThrow();
  });
  test('failure', () => {
    expect(() => {
      v.validate(v.coordinates, 'foo');
    }).toThrow('expected an array of [longitude, latitude]');
    expect(() => {
      v.validate(v.coordinates, 2);
    }).toThrow('expected an array of [longitude, latitude]');
    expect(() => {
      v.validate(v.coordinates, [-181, 10]);
    }).toThrow('expected an array of [longitude, latitude]');
    expect(() => {
      v.validate(v.coordinates, [-180, 91]);
    }).toThrow('expected an array of [longitude, latitude]');
  });
});

describe('oneOf', () => {
  describe('outside object', () => {
    test('success', () => {
      expect(() => v.validate(v.oneOf('aa', 'bb'), 'aa')).not.toThrow();
      expect(() => v.validate(v.oneOf('aa', 'bb'), 'bb')).not.toThrow();
    });
    test('failure', () => {
      expect(() => v.validate(v.oneOf('aa', 'bb'), 'cc')).toThrow(
        'expected "aa" or "bb"'
      );
    });
  });

  describe('inside object', () => {
    test('success', () => {
      expect(() =>
        v.validate({ foo: v.oneOf('aa', 'bb') }, { foo: 'bb' })
      ).not.toThrow();
    });
    test('failure', () => {
      expect(() =>
        v.validate({ foo: v.oneOf('aa', 'bb') }, { foo: 'cc' })
      ).toThrow('foo must be "aa" or "bb"');
    });
  });

  describe('required', () => {
    test('success', () => {
      expect(() =>
        v.validate({ foo: v.required(v.oneOf('aa', 'bb')) }, { foo: 'aa' })
      ).not.toThrow();
      expect(() =>
        v.validate({ foo: v.required(v.oneOf('aa', 'bb')) }, { foo: 'bb' })
      ).not.toThrow();
    });
    test('failure', () => {
      expect(() =>
        v.validate({ foo: v.required(v.oneOf('aa', 'bb')) }, {})
      ).toThrow('foo is required');
    });
  });
});

describe('oneOfType', () => {
  test('success', () => {
    expect(() => {
      v.validate(v.oneOfType(v.string, v.arrayOf(v.number)), [6, 7]);
      v.validate(v.oneOfType(v.string, v.arrayOf(v.number)), 'seven');
      v.validate(
        { foo: v.oneOfType(v.string, v.arrayOf(v.number)) },
        { foo: [6, 7] }
      );
      v.validate(
        { foo: v.oneOfType(v.string, v.arrayOf(v.number)) },
        { foo: 'seven' }
      );
    }).not.toThrow();
  });
  test('failure', () => {
    expect(() => {
      v.validate(v.oneOfType(v.string, v.number, v.arrayOf(v.number)), true);
    }).toThrow('expected a string, a number, or an array');
    expect(() => {
      v.validate(v.oneOfType(v.string, v.arrayOf(v.number)), [1, 'foo']);
    }).toThrow('expected a string or an array whose every item is a number');
  });
});
