'use strict';

const fs = require('fs');
const path = require('path');
const v = require('../validator');
const tu = require('../../../test/test-utils');

test('rejects properties not in schema', () => {
  const validate = () => {
    const config = {
      one: 1
    };
    v.validate(
      {
        two: v.number
      },
      config
    );
  };
  tu.expectError(validate, error => {
    expect(error.message).toBe('one is not a valid option');
  });
});

test('by default properties are not required', () => {
  const validate = () => {
    const config = {
      one: 1
    };
    v.validate(
      {
        one: v.number,
        two: v.number
      },
      config
    );
  };
  expect(validate()).toBeUndefined();
});

test('optional properties can be null or undefined', () => {
  const validate = () => {
    const config = {
      one: null,
      two: undefined
    };
    v.validate(
      {
        one: v.number,
        two: v.number
      },
      config
    );
  };
  expect(validate()).toBeUndefined();
});

test('rejects configs missing required properties', () => {
  const validate = () => {
    const config = {
      one: 1
    };
    v.validate(
      {
        one: v.number,
        two: v.number.required
      },
      config
    );
  };
  tu.expectError(validate, error => {
    expect(error.message).toBe('two is required');
  });
});

describe('expect an empty config', () => {
  const validateForEmpty = config => {
    return v.validate({}, config);
  };

  test('accept empty config', () => {
    expect(validateForEmpty()).toBeUndefined();
    expect(validateForEmpty({})).toBeUndefined();
  });

  test('reject non-empty config', () => {
    tu.expectError(
      () => validateForEmpty({ foo: 'bar' }),
      error => {
        expect(error.message).toBe('foo is not a valid option');
      }
    );
  });
});

describe('v.string', () => {
  const validateForString = config => {
    return v.validate(
      {
        prop: v.string.required
      },
      config
    );
  };

  const expectRejection = config => {
    tu.expectError(
      () => validateForString(config),
      error => {
        expect(error.message).toBe('prop must be a string');
      }
    );
  };

  test('rejects numbers', () => {
    expectRejection({ prop: 6 });
  });
  test('rejects booleans', () => {
    expectRejection({ prop: true });
  });
  test('rejects objects', () => {
    expectRejection({ prop: { foo: 'bar' } });
  });
  test('rejects arrays', () => {
    expectRejection({ prop: ['a', 'b'] });
  });

  test('accepts strings', () => {
    expect(validateForString({ prop: 'ham' })).toBeUndefined();
  });
});

describe('v.number', () => {
  const validateForNumber = config => {
    return v.validate(
      {
        prop: v.number.required
      },
      config
    );
  };

  const expectRejection = config => {
    tu.expectError(
      () => validateForNumber(config),
      error => {
        expect(error.message).toBe('prop must be a number');
      }
    );
  };

  test('rejects strings', () => {
    expectRejection({ prop: 'strings' });
  });
  test('rejects booleans', () => {
    expectRejection({ prop: true });
  });
  test('rejects objects', () => {
    expectRejection({ prop: { foo: 'bar' } });
  });
  test('rejects arrays', () => {
    expectRejection({ prop: ['a', 'b'] });
  });

  test('accepts numbers', () => {
    expect(validateForNumber({ prop: 5 })).toBeUndefined();
  });
});

describe('v.boolean', () => {
  const validateForBoolean = config => {
    return v.validate(
      {
        prop: v.boolean.required
      },
      config
    );
  };

  const expectRejection = config => {
    tu.expectError(
      () => validateForBoolean(config),
      error => {
        expect(error.message).toBe('prop must be a boolean');
      }
    );
  };

  test('rejects strings', () => {
    expectRejection({ prop: 'strings' });
  });
  test('rejects numbers', () => {
    expectRejection({ prop: 4 });
  });
  test('rejects objects', () => {
    expectRejection({ prop: { foo: 'bar' } });
  });
  test('rejects arrays', () => {
    expectRejection({ prop: ['a', 'b'] });
  });

  test('accepts booleans', () => {
    expect(validateForBoolean({ prop: true })).toBeUndefined();
    expect(validateForBoolean({ prop: false })).toBeUndefined();
  });
});

describe('v.arrayOfStrings', () => {
  const validateForArrayOfStrings = config => {
    return v.validate(
      {
        prop: v.arrayOfStrings.required
      },
      config
    );
  };

  const expectRejection = config => {
    tu.expectError(
      () => validateForArrayOfStrings(config),
      error => {
        expect(error.message).toBe('prop must be an array of strings');
      }
    );
  };

  test('rejects strings', () => {
    expectRejection({ prop: 'strings' });
  });
  test('rejects numbers', () => {
    expectRejection({ prop: 4 });
  });
  test('rejects objects', () => {
    expectRejection({ prop: { foo: 'bar' } });
  });
  test('rejects boolean', () => {
    expectRejection({ prop: true });
  });

  test('accepts arrays of strings', () => {
    expect(validateForArrayOfStrings({ prop: ['a', 'b'] })).toBeUndefined();
  });
});

describe('v.plainObject', () => {
  const validateForPlainObjects = config => {
    return v.validate(
      {
        prop: v.plainObject.required
      },
      config
    );
  };

  const expectRejection = config => {
    tu.expectError(
      () => validateForPlainObjects(config),
      error => {
        expect(error.message).toBe('prop must be an object');
      }
    );
  };

  test('rejects strings', () => {
    expectRejection({ prop: 'strings' });
  });
  test('rejects numbers', () => {
    expectRejection({ prop: 4 });
  });
  test('rejects arrays of strings', () => {
    expectRejection({ prop: ['a', 'b'] });
  });
  test('rejects boolean', () => {
    expectRejection({ prop: true });
  });

  test('accepts plain objects', () => {
    expect(
      validateForPlainObjects({ prop: { foo: 'bar', baz: 43 } })
    ).toBeUndefined();
  });
});

describe('v.date', () => {
  const validateForDate = config => {
    return v.validate(
      {
        prop: v.date.required
      },
      config
    );
  };

  const expectRejection = config => {
    tu.expectError(
      () => validateForDate(config),
      error => {
        expect(error.message).toBe('prop must be a date');
      }
    );
  };

  test('rejects strings that cannot be coerced into dates', () => {
    expectRejection({ prop: 'strings' });
  });
  test('rejects arrays of strings', () => {
    expectRejection({ prop: ['a', 'b'] });
  });
  test('rejects objects', () => {
    expectRejection({ prop: { foo: 'bar' } });
  });
  test('rejects boolean', () => {
    expectRejection({ prop: true });
  });

  test('accepts numbers', () => {
    expect(validateForDate({ prop: 1523483442214 })).toBeUndefined();
  });
  test('accepts strings that can be concerned into dates', () => {
    expect(
      validateForDate({ prop: '1969-12-31T23:59:59.997Z' })
    ).toBeUndefined();
  });
  test('accepts Date objects', () => {
    expect(validateForDate({ prop: new Date() })).toBeUndefined();
  });
});

describe('v.file in Node', () => {
  const validateForFile = config => {
    return v.validate(
      {
        prop: v.file.required
      },
      config
    );
  };

  const expectRejection = config => {
    tu.expectError(
      () => validateForFile(config),
      error => {
        expect(error.message).toBe(
          'prop must be a filename or Readable stream'
        );
      }
    );
  };

  test('rejects numbers', () => {
    expectRejection({ prop: 4 });
  });
  test('rejects booleans', () => {
    expectRejection({ prop: true });
  });
  test('rejects objects', () => {
    expectRejection({ prop: { foo: 'bar' } });
  });
  test('rejects arrays', () => {
    expectRejection({ prop: ['a', 'b'] });
  });

  test('accepts strings', () => {
    expect(validateForFile({ prop: 'path/to/file.txt' })).toBeUndefined();
  });
  test('accepts Readable streams', () => {
    expect(
      validateForFile({
        prop: fs.createReadStream(path.join(__dirname, './fixtures/foo.txt'))
      })
    ).toBeUndefined();
  });
});

describe('v.oneOf', () => {
  describe('pair combination', () => {
    const validateForOneOf = config => {
      return v.validate(
        {
          prop: v.oneOf([v.arrayOfStrings, v.string])
        },
        config
      );
    };

    const expectRejection = config => {
      tu.expectError(
        () => validateForOneOf(config),
        error => {
          expect(error.message).toBe(
            'prop must be an array of strings or must be a string'
          );
        }
      );
    };

    test('rejects numbers', () => {
      expectRejection({ prop: 4 });
    });
    test('rejects objects', () => {
      expectRejection({ prop: { foo: 'bar' } });
    });
    test('rejects boolean', () => {
      expectRejection({ prop: true });
    });

    test('fails on array of booleans', () => {
      expectRejection({ prop: [true] });
    });

    test('pass unstrict', () => {
      expect(validateForOneOf({})).toBeUndefined();
    });

    test('accepts strings', () => {
      expect(validateForOneOf({ prop: 'strings' })).toBeUndefined();
    });

    test('accepts arrays of strings', () => {
      expect(validateForOneOf({ prop: ['a', 'b'] })).toBeUndefined();
    });
  });

  describe('required', () => {
    const strictValidateForOneOf = config => {
      return v.validate(
        {
          prop: v.oneOf([v.arrayOfStrings, v.string]).required
        },
        config
      );
    };

    test('required', () => {
      expect(() => strictValidateForOneOf({})).toThrowError('prop is required');
    });

    test('accepts strings', () => {
      expect(strictValidateForOneOf({ prop: 'strings' })).toBeUndefined();
    });

    test('accepts arrays of strings', () => {
      expect(strictValidateForOneOf({ prop: ['a', 'b'] })).toBeUndefined();
    });

    test('should throw when some of oneOf item have required', () => {
      expect(() =>
        v.validate(
          {
            prop: v.oneOf([v.arrayOfStrings.required, v.string]).required
          },
          { prop: ['a', 'b'] }
        )
      ).toThrow();
      expect(() =>
        v.validate(
          {
            prop: v.oneOf([v.arrayOfStrings.required, v.string])
          },
          { prop: ['a', 'b'] }
        )
      ).toThrow();
    });
  });
});

describe('v.arrayOfObjects', () => {
  const validateForArrayOfObjects = config => {
    return v.validate(
      {
        prop: v.arrayOfObjects.required
      },
      config
    );
  };

  const expectRejection = config => {
    tu.expectError(
      () => validateForArrayOfObjects(config),
      error => {
        expect(error.message).toBe('prop must be an array of objects');
      }
    );
  };

  test('rejects strings', () => {
    expectRejection({ prop: 'strings' });
  });
  test('rejects numbers', () => {
    expectRejection({ prop: 4 });
  });
  test('rejects objects', () => {
    expectRejection({ prop: { foo: 'bar' } });
  });
  test('rejects boolean', () => {
    expectRejection({ prop: true });
  });

  test('accepts arrays of objects', () => {
    expect(
      validateForArrayOfObjects({ prop: [{ a: 'a' }, { b: 'b' }] })
    ).toBeUndefined();
  });
});
