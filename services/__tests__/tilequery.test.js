'use strict';

const tilequeryService = require('../tilequery');
const tu = require('../../test/test-utils');

let tilequery;
beforeEach(() => {
  tilequery = tilequeryService(tu.mockClient());
});

describe('listFeatures', () => {
  test('with minimal config', () => {
    tilequery.listFeatures({
      mapIds: ['foo'],
      coordinates: [10, 12]
    });
    expect(tu.requestConfig(tilequery)).toEqual({
      path: '/v4/:mapIds/tilequery/:coordinates.json',
      method: 'GET',
      params: {
        mapIds: ['foo'],
        coordinates: [10, 12]
      },
      query: {}
    });
  });

  test('with multiple map IDs', () => {
    tilequery.listFeatures({
      mapIds: ['foo', 'bar'],
      coordinates: [10, 12]
    });
    expect(tu.requestConfig(tilequery)).toEqual({
      path: '/v4/:mapIds/tilequery/:coordinates.json',
      method: 'GET',
      params: {
        mapIds: ['foo', 'bar'],
        coordinates: [10, 12]
      },
      query: {}
    });
  });

  test('with all config options', () => {
    tilequery.listFeatures({
      mapIds: ['foo', 'bar'],
      coordinates: [10, 12],
      radius: 39,
      limit: 3,
      dedupe: false,
      layers: ['egg', 'sandwich'],
      geometry: 'point'
    });
    expect(tu.requestConfig(tilequery)).toEqual({
      path: '/v4/:mapIds/tilequery/:coordinates.json',
      method: 'GET',
      params: {
        mapIds: ['foo', 'bar'],
        coordinates: [10, 12]
      },
      query: {
        radius: 39,
        limit: 3,
        dedupe: false,
        layers: ['egg', 'sandwich'],
        geometry: 'point'
      }
    });
  });
});
