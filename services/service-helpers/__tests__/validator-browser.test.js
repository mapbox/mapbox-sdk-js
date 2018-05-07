/**
 * @jest-environment jsdom
 */
'use strict';

const v = require('../validator');
const tu = require('../../../test/test-utils');

describe('v.file in the browser', () => {
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
        expect(error.message).toBe('prop must be a Blob or ArrayBuffer');
      }
    );
  };

  test('rejects strings', () => {
    expectRejection({ prop: 'path/to/file.txt' });
  });
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

  test('accepts Blobs', () => {
    expect(
      validateForFile({ prop: new global.Blob(['blobbbbb']) })
    ).toBeUndefined();
  });
  test('accepts ArrayBuffers', () => {
    expect(
      validateForFile({ prop: new global.ArrayBuffer(3) })
    ).toBeUndefined();
  });
});
