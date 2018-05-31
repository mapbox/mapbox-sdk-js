'use strict';
/* eslint-env es6,jest,node */

var v = require('./validator');

var t = function(rootcheck) {
  return function(value) {
    var messages = v.validate(rootcheck, value);
    return messages;
  };
};

var req = v.required;

describe('v.shape', () => {
  test('plain object', () => {
    var check = t(v.shape({ name: v.string }));

    expect(check({})).toBeUndefined();

    expect(check({ name: 9 })).toEqual(['name', 'string']);

    expect(check({ name: 'jack' })).toBeUndefined();
  });

  test('irrelevant values in object', () => {
    let check = t(v.shape({ name: v.string }));

    expect(check({ garbage: 'garbage' })).toBeUndefined();
  });

  test('required', () => {
    var check = t(v.shape({ name: req(v.string) }));

    expect(check({})).toEqual(['name', expect.any(Function)]);
  });

  test('empty values', () => {
    var check = t(v.shape({ name: v.string }));

    expect(check(undefined)).toBeUndefined();
  });

  test('nested object', () => {
    var check = t(v.shape({ person: v.shape({ name: v.string }) }));

    expect(check({ person: { name: 'jack' } })).toBeUndefined();

    expect(check({ person: { name: 9 } })).toEqual([
      'person',
      'name',
      'string'
    ]);

    expect(check({ person: { name: {} } })).toEqual([
      'person',
      'name',
      'string'
    ]);
  });

  test('empty values to a nested object', () => {
    var check = t(v.shape({ person: v.shape({ name: v.string }) }));

    expect(check()).toEqual();

    expect(check({})).toEqual();

    expect(check({ person: undefined })).toEqual();

    expect(check({ person: {} })).toEqual();

    expect(check({ person: { name: null } })).toEqual();
  });

  test('top level require ', () => {
    var check = t(req(v.shape({ person: v.shape({ name: v.string }) })));

    expect(check()).toEqual([expect.any(Function)]);

    expect(check({})).toBeUndefined();
  });

  test('nested require', () => {
    var check = t(v.shape({ person: req(v.shape({ name: v.string })) }));

    expect(check({})).toEqual(['person', expect.any(Function)]);

    expect(check({ person: 9 })).toEqual(['person', 'object']);

    expect(check({ person: {} })).toBeUndefined();
  });

  test('deep nesting', () => {
    var check = t(
      v.shape({
        person: v.shape({
          name: v.shape({ first: req(v.shape({ initial: v.string })) })
        })
      })
    );

    expect(
      check({ person: { name: { first: { initial: 'j' } } } })
    ).toBeUndefined();

    expect(check({ person: { name: 9 } })).toEqual([
      'person',
      'name',
      'object'
    ]);

    expect(check({ person: { name: { first: 9 } } })).toEqual([
      'person',
      'name',
      'first',
      'object'
    ]);

    expect(check({ person: { name: {} } })).toEqual([
      'person',
      'name',
      'first',
      expect.any(Function)
    ]);

    expect(check({ person: { name: { first: { initial: 0 } } } })).toEqual([
      'person',
      'name',
      'first',
      'initial',
      'string'
    ]);
  });
});

describe('v.arrayOf', () => {
  test('plain array', () => {
    var check = t(v.arrayOf(v.string));

    expect(check([])).toBeUndefined();

    expect(check(undefined)).toBeUndefined();

    expect(check(['s'])).toBeUndefined();

    expect(check(['good', 'bad'])).toBeUndefined();

    expect(check([[]])).toEqual([0, 'string']);

    expect(check([['good']])).toEqual([0, 'string']);

    expect(check([9])).toEqual([0, 'string']);

    expect(check(['good', 9])).toEqual([1, 'string']);
  });

  test('required', () => {
    var check = t(req(v.arrayOf(v.string)));

    expect(check([])).toBeUndefined();

    expect(check([null])).toBeUndefined();

    expect(check(null)).toEqual([expect.any(Function)]);
  });

  test('child require', () => {
    var check = t(v.arrayOf(req(v.string)));

    expect(check(['good', null])).toEqual([1, expect.any(Function)]);

    expect(check(['good', 'bad', null])).toEqual([2, expect.any(Function)]);
  });

  test('nesting', () => {
    var check = t(req(v.arrayOf(v.arrayOf(v.string))));

    expect(check([])).toBeUndefined();

    expect(check([[9]])).toEqual([0, 0, 'string']);
  });

  test('nesting with child require', () => {
    var check = t(v.arrayOf(v.arrayOf(req(v.string))));

    expect(check([['good', null]])).toEqual([0, 1, expect.any(Function)]);

    expect(check([['good', 'good'], ['bad', {}]])).toEqual([1, 1, 'string']);
  });
});

describe('mix of v.arrayOf & v.shape', () => {
  test('arrayOf <- shape', () => {
    var check = t(v.arrayOf(v.shape({ name: req(v.string) })));

    expect(check([{ name: 'ram' }, 9])).toEqual([1, 'object']);

    expect(check([{ name: 9 }])).toEqual([0, 'name', 'string']);

    expect(check([{ name: null }])).toEqual([0, 'name', expect.any(Function)]);
  });

  test('shape <- arrayOf', () => {
    var check = t(v.shape({ name: v.arrayOf(v.string) }));

    expect(check({ name: [] })).toBeUndefined();

    expect(check({ name: ['good'] })).toBeUndefined();

    expect(check({ name: 9 })).toEqual(['name', 'array']);

    expect(
      check({
        name: ['good', 0, 'bad']
      })
    ).toEqual(['name', 1, 'string']);
  });
});

describe('v.oneOfType', () => {
  test('simple', () => {
    var check = t(v.oneOfType(v.number, v.string));

    expect(check(9)).toBeUndefined();

    expect(check(null)).toBeUndefined();

    expect(check('good')).toBeUndefined();

    expect(check({})).toEqual(['number or string']);
  });

  test('require', () => {
    var check = t(req(v.oneOfType(v.number, v.string)));

    expect(check()).toEqual([expect.any(Function)]);
  });

  test('multiple types', () => {
    var check = t(
      req(v.oneOfType(v.number, v.string, v.plainArray, v.plainObject))
    );

    expect(check([])).toBeUndefined();

    expect(check(9)).toBeUndefined();

    expect(check({})).toBeUndefined();

    expect(check('good')).toBeUndefined();

    expect(check(false)).toEqual(['number, string, array or object']);
  });

  test('multiple types as an array', () => {
    var check = t(
      req(v.oneOfType([v.number, v.string, v.plainArray, v.plainObject]))
    );

    expect(check([])).toBeUndefined();

    expect(check(9)).toBeUndefined();

    expect(check({})).toBeUndefined();

    expect(check('good')).toBeUndefined();

    expect(check(false)).toEqual(['number, string, array or object']);
  });

  test('nested object', () => {
    var check = t(v.shape({ name: v.oneOfType(v.number, v.string) }));

    expect(check({ name: 'jack' })).toBeUndefined();

    expect(check([])).toEqual(['object']);

    expect(check({ name: false })).toEqual(['name', 'number or string']);
  });

  test('nested array', () => {
    var check = t(
      v.arrayOf(
        v.shape({
          name: v.oneOfType(v.number, v.string)
        })
      )
    );

    expect(check([{ name: 'jack' }])).toBeUndefined();

    expect(check([{ name: 'jack' }, { name: 'daniels' }])).toBeUndefined();

    expect(check([{ name: 'jack' }, { name: 2 }])).toBeUndefined();

    expect(check([{ name: 'jack' }, { name: false }])).toEqual([
      1,
      'name',
      'number or string'
    ]);
  });

  test('complex type with primitive', () => {
    var check = t(req(v.oneOfType(v.shape({ name: v.string }), v.string)));

    expect(check({ name: 'jack' })).toBeUndefined();

    expect(check()).toEqual([expect.any(Function)]);

    expect(check('jack')).toBeUndefined();

    expect(check(false)).toEqual(['object or string']);

    // current implementation doesn't handle enumeration of
    // all complex types exhaustively.
    // ideally we would wanna tell user that it
    // can either be {name: string} or string
    expect(check({ name: false })).toEqual(['name', 'string']);
  });

  test('nested complex types', () => {
    var check = t(
      req(
        v.oneOfType(
          v.shape({ name: v.oneOfType(v.string, v.number) }),
          v.arrayOf(v.oneOfType(v.string, v.number))
        )
      )
    );

    expect(check('jack')).toEqual(['object or array']);

    expect(check()).toEqual([expect.any(Function)]);

    expect(check({ name: 'jack' })).toBeUndefined();

    expect(check({ name: 9 })).toBeUndefined();

    expect(check({ name: false })).toEqual(['name', 'string or number']);

    expect(check(['name'])).toEqual();

    expect(check([9])).toEqual();

    expect(check([9, false])).toEqual([1, 'string or number']);
  });

  test('similar shape complex types', () => {
    var check = t(
      req(
        v.oneOfType(
          v.shape({ name: req(v.string) }),
          v.shape({ name: v.number })
        )
      )
    );

    expect(check({ name: 9 })).toBeUndefined();

    expect(check({ name: 'good' })).toBeUndefined();

    expect(check({ name: false })).toEqual(['name', 'string']);
  });
});

describe('v.string', () => {
  test('outside object', () => {
    var check = t(v.string);

    expect(check(9)).toEqual(['string']);

    expect(check(null)).toEqual();

    expect(check(undefined)).toEqual();
  });

  test('outside object with', () => {
    var check = t(req(v.string));

    expect(check(9)).toEqual(['string']);

    expect(check(null)).toEqual([expect.any(Function)]);

    expect(check(undefined)).toEqual([expect.any(Function)]);
  });

  test('inside an object', () => {
    expect(t(v.shape({ name: req(v.string) }))({ name: 'jack' })).toBe(
      undefined
    );
    expect(t(v.shape({ name: v.string }))({ name: 9 })).toEqual([
      'name',
      'string'
    ]);
  });
});

describe('v.range', () => {
  test('success', () => {
    expect(t(v.range([1, 5]))(4)).toBeUndefined();

    expect(t(v.range([1, 5]))(5)).toBeUndefined();

    expect(t(v.range([1, 5]))(1)).toBeUndefined();

    expect(t(v.range([1, 5]))(2.33)).toBeUndefined();
  });
  test('failure', () => {
    expect(t(v.range([1, 5]))('foo')).toEqual([
      'number between 1 & 5 (inclusive)'
    ]);

    expect(t(v.range([1, 5]))(6)).toEqual(['number between 1 & 5 (inclusive)']);

    expect(t(v.range([1, 5]))(-2)).toEqual([
      'number between 1 & 5 (inclusive)'
    ]);
  });
});

describe('v.coordinates', () => {
  test('success', () => {
    expect(t(v.coordinates)([10, 11])).toBeUndefined();

    expect(t(v.coordinates)([-90, -83])).toBeUndefined();
  });

  test('failure', () => {
    expect(t(v.coordinates)('foo')).toEqual(['array of [longitude, latitude]']);

    expect(t(v.coordinates)(2)).toEqual(['array of [longitude, latitude]']);

    expect(t(v.coordinates)([-181, 10])).toEqual([
      'array of [longitude, latitude]'
    ]);

    expect(t(v.coordinates)([-180, 91])).toEqual([
      'array of [longitude, latitude]'
    ]);
  });
});

describe('v.oneOf', () => {
  describe('outside object', () => {
    test('success', () => {
      expect(t(v.oneOf('aa', 'bb'))('aa')).toBeUndefined();
      expect(t(v.oneOf('aa', 'bb'))('bb')).toBeUndefined();
      expect(t(v.oneOf(['aa', 'bb']))('bb')).toBeUndefined();
    });
    test('failure', () => {
      expect(t(v.oneOf('aa', 'bb'))('cc')).toEqual(['"aa" or "bb"']);
      expect(t(v.oneOf(['aa', 'bb']))('cc')).toEqual(['"aa" or "bb"']);
    });
  });

  describe('inside object', () => {
    test('success', () => {
      expect(t(v.shape({ foo: v.oneOf('aa', 'bb') }))({ foo: 'bb' })).toEqual();
    });
    test('failure', () => {
      expect(t(v.shape({ foo: v.oneOf('aa', 'bb') }))({ foo: 'cc' })).toEqual([
        'foo',
        '"aa" or "bb"'
      ]);
    });
  });

  describe('required', () => {
    test('success', () => {
      expect(
        t(v.shape({ foo: req(v.oneOf('aa', 'bb')) }))({ foo: 'aa' })
      ).toEqual();
      expect(
        t(v.shape({ foo: req(v.oneOf('aa', 'bb')) }))({ foo: 'bb' })
      ).toEqual();
    });

    test('failure', () => {
      expect(t(v.shape({ foo: req(v.oneOf('aa', 'bb')) }))({})).toEqual([
        'foo',
        expect.any(Function)
      ]);
    });
  });

  describe('inside array', () => {
    var check = t(v.arrayOf(req(v.oneOf('aa', 'bb'))));

    expect(check(['aa'])).toBeUndefined();

    expect(check(['bb'])).toBeUndefined();

    expect(check(['bb', 'cc'])).toEqual([1, '"aa" or "bb"']);

    expect(check(['aa', false])).toEqual([1, '"aa" or "bb"']);

    expect(check(['aa', 'bb', false])).toEqual([2, '"aa" or "bb"']);
  });
});

describe('v.number', () => {
  var check = t(v.number);
  test('rejects strings', () => {
    expect(check('str')).toEqual(['number']);
  });
  test('rejects booleans', () => {
    expect(check(false)).toEqual(['number']);
  });

  test('rejects objects', () => {
    expect(check(false)).toEqual(['number']);
  });

  test('accepts numbers', () => {
    expect(check(5)).toBeUndefined();
  });
});

describe('v.boolean', () => {
  var check = t(v.boolean);
  test('rejects strings', () => {
    expect(check('str')).toEqual(['boolean']);
  });

  test('rejects objects', () => {
    expect(check({})).toEqual(['boolean']);
  });

  test('accepts boolean', () => {
    expect(check(false)).toBeUndefined();
  });
});

describe('v.plainObject', () => {
  var check = t(v.plainObject);
  test('rejects strings', () => {
    expect(check('str')).toEqual(['object']);
  });

  test('rejects bool', () => {
    expect(check(false)).toEqual(['object']);
  });

  test('accepts object', () => {
    expect(check({})).toBeUndefined();
  });
});

describe('v.date', () => {
  var check = t(v.date);
  test('rejects strings', () => {
    expect(check('strings')).toEqual(['date']);
  });

  test('rejects arrays of strings', () => {
    expect(check(['a', 'b'])).toEqual(['date']);
  });

  test('rejects object', () => {
    expect(check({})).toEqual(['date']);
  });

  test('accepts numbers', () => {
    expect(check(92323)).toBeUndefined();
  });

  test('accepts strings that can be concerned into dates', () => {
    expect(check('1969-12-31T23:59:59.997Z')).toBeUndefined();
  });

  test('accepts Date objects', () => {
    expect(check(new Date())).toBeUndefined();
  });
});

describe('v.assert', () => {
  test('string', () => {
    var check = v.assert(v.string);
    expect(() => check(9)).toThrowError('value must be a string.');
  });

  test('number', () => {
    var check = v.assert(v.number);
    expect(() => check(false)).toThrowError('value must be a number.');
  });

  test('range', () => {
    var check = v.assert(v.range([0, 10]));
    expect(() => check(11)).toThrowError(
      'value must be a number between 0 & 10 (inclusive)'
    );
  });

  test('boolean', () => {
    var check = v.assert(v.boolean);
    expect(() => check(9)).toThrowError('value must be a boolean.');
  });

  test('coordinates', () => {
    var check = v.assert(v.coordinates);
    expect(() => check(9)).toThrowError(
      'value must be an array of [longitude, latitude].'
    );
  });

  test('date', () => {
    var check = v.assert(v.date);
    expect(() => check(false)).toThrowError('value must be a date.');
  });

  test('plainArray', () => {
    var check = v.assert(v.plainArray);
    expect(() => check(false)).toThrowError('value must be an array.');
  });

  test('plainObject', () => {
    var check = v.assert(v.plainObject);
    expect(() => check(false)).toThrowError('value must be an object.');
  });

  test('plainObject', () => {
    var check = v.assert(v.plainObject);
    expect(() => check(false)).toThrowError('value must be an object.');
  });

  test('equal', () => {
    var check = v.assert(v.equal('Delhi'));
    expect(() => check(false)).toThrowError('value must be a "Delhi".');
  });

  test('v.oneOfType', () => {
    var check = v.assert(
      v.shape({
        prop: v.shape({
          person: v.shape({
            weight: v.oneOfType(v.string, v.range([0, 100]))
          })
        })
      })
    );
    expect(() =>
      check({ prop: { person: { weight: 'jack' } } })
    ).not.toThrowError();

    expect(() =>
      check({ prop: { person: { who: 'jack' } } })
    ).not.toThrowError();

    expect(() => check({ prop: { person: { weight: 120 } } })).toThrowError(
      'prop.person.weight must be a string or number between 0 & 100 (inclusive).'
    );
  });

  describe('v.shape', () => {
    test('simple object', () => {
      var check = v.assert(v.shape({ prop: v.string }));
      expect(() => check({ prop: 9 })).toThrowError('prop must be a string.');
    });
    test('nested object', () => {
      var check = v.assert(
        v.shape({
          prop: v.shape({ person: v.shape({ name: v.string }) })
        })
      );

      expect(() => check({ prop: { person: 9 } })).toThrowError(
        'prop.person must be an object.'
      );

      expect(() => check({ prop: { person: { name: 9 } } })).toThrowError(
        'prop.person.name must be a string.'
      );
    });

    test('nested object with array', () => {
      var check = v.assert(
        v.shape({
          prop: v.shape({ person: v.shape({ name: v.arrayOf(v.string) }) })
        })
      );
      expect(() => check({ prop: { person: { name: 9 } } })).toThrowError(
        'prop.person.name must be an array.'
      );
      expect(() => check({ prop: { person: { name: [false] } } })).toThrowError(
        'Item at position prop.person.name.0 must be a string.'
      );
    });

    test('nested object with oneOfType', () => {
      var check = v.assert(
        v.shape({
          prop: v.shape({
            person: v.shape({
              name: v.oneOfType(v.arrayOf(v.string), v.plainObject)
            })
          })
        })
      );

      expect(() => check({ prop: { person: { name: 9 } } })).toThrowError(
        'prop.person.name must be an array or object.'
      );
    });
  });

  describe('v.arrayOf', () => {
    test('simple array', () => {
      var check = v.assert(v.arrayOf(v.range([0, 5])));
      expect(() => check([2, 6])).toThrowError(
        'Item at position 1 must be a number between 0 & 5 (inclusive).'
      );
    });

    test('array with object', () => {
      var check = v.assert(
        v.arrayOf(v.shape({ prop: v.arrayOf(v.equal('c')) }))
      );
      expect(() => check([{ prop: ['c'] }, { prop: ['c', 'd'] }])).toThrowError(
        'Item at position 1.prop.1 must be a "c".'
      );
    });
  });

  describe('v.oneOf', () => {
    test('simple array', () => {
      var check = v.assert(v.oneOf(9, 10));
      expect(() => check([20])).toThrowError('value must be a 9 or 10.');
      expect(() => check(11)).toThrowError('value must be a 9 or 10.');
    });

    test('nested', () => {
      var check = v.assert(
        v.shape({
          prop: v.shape({
            person: v.shape({ name: v.oneOf('Jack', 'Daniels') })
          })
        })
      );
      expect(() => check({ prop: { person: { name: 'jack' } } })).toThrowError(
        'prop.person.name must be a "Jack" or "Daniels".'
      );
    });
  });

  describe('v.shape multiple errors', () => {
    var check = v.assert(
      v.shape({
        profile: v.oneOf('driving-traffic', 'driving', 'walking', 'cycling'),
        waypoints: v.required(
          v.arrayOf(
            v.shape({
              coordinates: v.required(v.coordinates),
              approach: v.oneOf('unrestricted', 'curb'),
              bearing: v.arrayOf(v.number),
              radius: v.oneOfType(v.number, v.equal('unlimited')),
              waypointName: v.string
            })
          )
        ),
        alternatives: v.boolean
      })
    );
    test('passes', () => {
      expect(() =>
        check({
          waypoints: { coordinates: [10, 10] },
          alternatives: false
        })
      ).toThrowErrorMatchingSnapshot();
    });

    test('missing values', () => {
      expect(() =>
        check({
          alternatives: 9
        })
      ).toThrowErrorMatchingSnapshot();
    });

    test('nested values', () => {
      expect(() =>
        check({
          profile: 'wrong',
          waypoints: [
            {
              coordinates: false,
              radius: 'limited',
              bearing: [9, 9, 'str']
            }
          ],
          alternatives: 9
        })
      ).toThrowErrorMatchingSnapshot();
    });
  });
});

describe('v.required', () => {
  test('string', () => {
    var check = v.assert(req(v.string));
    expect(() => check()).toThrowError('value is required.');
  });

  test('number', () => {
    var check = v.assert(req(v.number));
    expect(() => check()).toThrowError('value is required.');
  });

  test('range', () => {
    var check = v.assert(req(v.range([0, 10])));
    expect(() => check(null)).toThrowError('value is required.');
  });

  test('boolean', () => {
    var check = v.assert(req(v.boolean));
    expect(() => check()).toThrowError('value is required.');
  });

  test('coordinates', () => {
    var check = v.assert(req(v.coordinates));
    expect(() => check()).toThrowError('value is required.');
  });

  test('date', () => {
    var check = v.assert(req(v.date));
    expect(() => check()).toThrowError('value is required.');
  });

  test('plainArray', () => {
    var check = v.assert(req(v.plainArray));
    expect(() => check()).toThrowError('value is required.');
  });

  test('plainObject', () => {
    var check = v.assert(req(v.plainObject));
    expect(() => check()).toThrowError('value is required.');
  });

  test('equal', () => {
    var check = v.assert(req(v.equal));

    expect(() => check()).toThrowError('value is required.');
  });

  test('v.oneOf', () => {
    var check = v.assert(
      v.shape({
        prop: v.shape({
          person: v.shape({ name: req(v.oneOf('Jack', 'Daniels')) })
        })
      })
    );
    expect(() => check({ prop: { person: { who: 'jack' } } })).toThrowError(
      'prop.person.name is required.'
    );
  });

  test('v.oneOfType', () => {
    var check = v.assert(
      v.shape({
        prop: v.shape({
          person: v.shape({
            weight: req(v.oneOfType(v.string, v.range([0, 100])))
          })
        })
      })
    );
    expect(() => check({ prop: { person: { who: 'jack' } } })).toThrowError(
      'prop.person.weight is required.'
    );
  });

  describe('v.shape', () => {
    test('simple object', () => {
      var check = v.assert(req(v.shape({ prop: v.string })));

      expect(() => check()).toThrowError('value is required.');

      expect(() => check({})).not.toThrowError();
    });

    test('required prop', () => {
      var check = v.assert(req(v.shape({ prop: req(v.string) })));
      expect(() => check({})).toThrowError('prop is required.');
    });

    test('nested required prop', () => {
      var check = v.assert(
        v.shape({
          prop: v.shape({ person: v.shape({ name: req(v.string) }) })
        })
      );

      expect(() => check({ prop: { person: {} } })).toThrowError(
        'prop.person.name is required.'
      );

      expect(() =>
        check({ prop: { person: { name: 'Jack' } } })
      ).not.toThrowError();
    });

    test('nested object with array', () => {
      var check = v.assert(
        v.shape({
          prop: v.shape({
            person: v.arrayOf(v.shape({ name: v.arrayOf(req(v.string)) }))
          })
        })
      );

      expect(() =>
        check({ prop: { person: [{ name: ['good', null] }] } })
      ).toThrowError(
        'Item at position prop.person.0.name.1 cannot be undefined/null.'
      );

      expect(() =>
        check({ prop: { person: [{ name: ['good', 'body'] }] } })
      ).not.toThrowError();
    });

    test('nested object with required oneOfType', () => {
      var check = v.assert(
        v.shape({
          prop: v.shape({
            person: v.shape({
              name: req(v.oneOfType(v.arrayOf(v.string), v.plainObject))
            })
          })
        })
      );

      expect(() => check({ prop: { person: { name: null } } })).toThrowError(
        'prop.person.name is required.'
      );

      expect(() =>
        check({ prop: { person: { name: {} } } })
      ).not.toThrowError();

      expect(() =>
        check({ prop: { person: { name: ['good'] } } })
      ).not.toThrowError();
    });
  });

  describe('v.arrayOf', () => {
    test('simple array', () => {
      var check = v.assert(req(v.arrayOf(v.string)));

      expect(() => check()).toThrowError('value is required.');

      expect(() => check([])).not.toThrowError();
    });

    test('array with nested object', () => {
      var check = v.assert(
        v.arrayOf(req(v.shape({ prop: req(v.equal('c')) })))
      );
      expect(() => check([{ prop: 'c' }, null])).toThrowError(
        'Item at position 1 cannot be undefined/null.'
      );
      expect(() => check([{}])).toThrowError(
        'Item at position 0.prop cannot be undefined/null.'
      );
    });
  });
});
