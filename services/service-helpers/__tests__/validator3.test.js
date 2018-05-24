'use strict';

const v = require('../validator3').v;

describe('v.shapeOf', () => {
  test('plain object', () => {
    expect(() => v.warn(v.shapeOf({ name: v.req(v.str) }))({})).toThrowError();

    expect(() => v.warn(v.shapeOf({ name: v.str }))({})).not.toThrowError();

    expect(() => v.warn(v.shapeOf({ name: v.str }))({ name: 9 })).toThrowError(
      'Validation failed! name must be string'
    );

    expect(() =>
      v.warn(v.shapeOf({ name: v.str }))({ name: 'jack' })
    ).not.toThrowError();

    expect(() =>
      v.warn(v.shapeOf({ last: v.str }))({ name: 'jack' })
    ).not.toThrowError();
  });

  describe('empty values', () => {
    expect(v.warn(v.shapeOf({ name: v.str }))(undefined)).toEqual(undefined);

    expect(() =>
      v.warn(v.shapeOf({ name: v.req(v.str) }))(undefined)
    ).not.toThrowError();

    expect(() =>
      v.warn(v.req(v.shapeOf({ name: v.req(v.str) })))(undefined)
    ).toThrowError('Validation failed! value is required');
  });

  describe('nested values', () => {
    var validator = v.warn(v.shapeOf({ person: v.shapeOf({ name: v.str }) }));
    expect(validator({ person: { name: 'jack' } })).toBeUndefined();

    expect(() => validator({ person: { name: 9 } })).toThrowError(
      'Validation failed! person.name must be string'
    );

    expect(() => validator({ person: { name: {} } })).toThrowError(
      'Validation failed! person.name must be string'
    );

    expect(() => validator()).not.toThrowError();
    expect(() => validator({})).not.toThrowError();
    expect(() => validator({ person: undefined })).not.toThrowError();
    expect(() => validator({ person: {} })).not.toThrowError();
    expect(() => validator({ person: { name: null } })).not.toThrowError();
  });

  describe('top level require ', () => {
    var validator = v.warn(
      v.req(v.shapeOf({ person: v.shapeOf({ name: v.str }) }))
    );
    expect(() => validator()).toThrowError();
    expect(() => validator({})).not.toThrowError();
  });

  describe('nested require', () => {
    var validator = v.warn(
      v.shapeOf({ person: v.req(v.shapeOf({ name: v.str })) })
    );

    expect(() => validator({})).toThrowError(
      'Validation failed! person is required'
    );
    expect(() => validator({ person: 9 })).toThrowError(
      'Validation failed! person must be object'
    );

    expect(() => validator({ person: {} })).not.toThrowError();
  });

  describe('deep nesting', () => {
    var validator = v.warn(
      v.shapeOf({
        person: v.shapeOf({
          name: v.shapeOf({ first: v.req(v.shapeOf({ char: v.str })) })
        })
      })
    );

    expect(() =>
      validator({ person: { name: { first: { char: 'j' } } } })
    ).not.toThrowError();

    expect(() => validator({ person: { name: 9 } })).toThrowError(
      'Validation failed! person.name must be object'
    );

    expect(() => validator({ person: { name: { first: 9 } } })).toThrowError(
      'Validation failed! person.name.first must be object'
    );
    expect(() => validator({ person: { name: { first: 9 } } })).toThrowError(
      'Validation failed! person.name.first must be object'
    );

    expect(() => validator({ person: { name: {} } })).toThrowError(
      'Validation failed! person.name.first is required'
    );

    expect(() => validator({ person: { name: { char: '9' } } })).toThrowError(
      'Validation failed! person.name.first is required'
    );

    expect(() =>
      validator({ person: { name: { first: { char: 0 } } } })
    ).toThrowError('Validation failed! person.name.first.char must be string');
  });
});

describe('string', () => {
  test('outside object', () => {
    var validator = v.warn(v.str);

    expect(() => validator(9)).toThrowError(
      'Validation failed! value must be string'
    );

    expect(() => validator(null)).not.toThrowError();

    expect(() => validator(undefined)).not.toThrowError();
  });

  test('required outside object', () => {
    var validator = v.warn(v.req(v.str));

    expect(() => validator(9)).toThrowError(
      'Validation failed! value must be string'
    );

    expect(() => validator(null)).toThrowError(
      'Validation failed! value is required'
    );

    expect(() => validator(undefined)).toThrowError(
      'Validation failed! value is required'
    );
  });

  test('inside object', () => {
    expect(v.warn(v.shapeOf({ name: v.req(v.str) }))({ name: 'jack' })).toBe(
      undefined
    );

    expect(() => v.warn((v.shapeOf({ foo: v.str }), {}))).not.toThrow();

    expect(() => v.warn(v.shapeOf({ name: v.str }))({ name: 9 })).toThrowError(
      'Validation failed! name must be string'
    );
  });
});

describe('arrayOf', () => {
  test('plain array', () => {
    expect(() => v.warn(v.arrayOf(v.str))([])).not.toThrowError();

    expect(() => v.warn(v.arrayOf(v.str))(null)).not.toThrowError();

    expect(() => v.warn(v.arrayOf(v.str))(undefined)).not.toThrowError();

    expect(() => v.warn(v.arrayOf(v.str))(['s'])).not.toThrowError();

    expect(() => v.warn(v.arrayOf(v.str))(['good', 'bad'])).not.toThrowError();

    expect(() => v.warn(v.arrayOf(v.str))([9])).toThrowError(
      'Validation failed! item at position 0 must be string'
    );

    expect(() => v.warn(v.arrayOf(v.str))(['good', 9])).toThrowError(
      'Validation failed! item at position 1 must be string'
    );
  });

  test('required', () => {
    expect(() => v.warn(v.req(v.arrayOf(v.str)))([])).not.toThrowError();

    expect(() => v.warn(v.req(v.arrayOf(v.str)))(null)).toThrowError(
      'Validation failed! value is required'
    );

    expect(() => v.warn(v.req(v.arrayOf(v.str)))([null])).not.toThrowError();

    expect(() =>
      v.warn(v.req(v.arrayOf(v.req(v.str))))(['good', null])
    ).toThrowError(
      'Validation failed! item at position 1 cannot be undefined/null'
    );
  });

  test('nesting', () => {
    expect(() =>
      v.warn(v.req(v.arrayOf(v.arrayOf(v.str))))([])
    ).not.toThrowError();

    expect(() =>
      v.warn(v.req(v.arrayOf(v.arrayOf(v.str))))([[9]])
    ).toThrowError('Validation failed! item at position 0.0 must be string');

    expect(() =>
      v.warn(v.req(v.arrayOf(v.arrayOf(v.req(v.str)))))([['good', null]])
    ).toThrowError(
      'Validation failed! item at position 0.1 cannot be undefined/null'
    );
  });
});

describe('mix of arrayOf & shapeOf', () => {
  it('arrayOf <- shapeOf', () => {
    expect(() =>
      v.warn(v.arrayOf(v.shapeOf({ name: v.req(v.str) })))([{}])
    ).toThrowError(
      'Validation failed! item at position 0.name cannot be undefined/null'
    );

    expect(() =>
      v.warn(v.arrayOf(v.shapeOf({ name: v.req(v.str) })))([{ name: 9 }])
    ).toThrowError('Validation failed! item at position 0.name must be string');

    expect(() =>
      v.warn(v.arrayOf(v.shapeOf({ name: v.req(v.str) })))([{ name: null }])
    ).toThrowError(
      'Validation failed! item at position 0.name cannot be undefined/null'
    );
  });

  it('shapeOf <- arrayOf', () => {
    expect(() =>
      v.warn(v.shapeOf({ name: v.arrayOf(v.str) }))({ name: [] })
    ).not.toThrowError();

    expect(() =>
      v.warn(v.shapeOf({ name: v.arrayOf(v.str) }))({ name: ['good'] })
    ).not.toThrowError();

    expect(() =>
      v.warn(v.shapeOf({ name: v.arrayOf(v.str) }))({
        name: ['good', 0, 'bad']
      })
    ).toThrowError('Validation failed! item at position name.1 must be string');
  });
});
