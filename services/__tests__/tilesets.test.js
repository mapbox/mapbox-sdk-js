'use strict';

const tilesetsService = require('../tilesets');
const tu = require('../../test/test-utils');

let tilesets;
beforeEach(() => {
  tilesets = tilesetsService(tu.mockClient());
});

describe('listTilesets', () => {
  test('works', () => {
    tilesets.listTilesets();
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:ownerId',
      method: 'GET',
      params: undefined
    });
  });

  test('works with specified ownerId', () => {
    tilesets.listTilesets({ ownerId: 'specialguy' });
    expect(tu.requestConfig(tilesets)).toEqual({
      path: '/tilesets/v1/:ownerId',
      method: 'GET',
      params: { ownerId: 'specialguy' }
    });
  });
});
