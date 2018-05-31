'use strict';

const geocodingService = require('../geocoding');
const tu = require('../../test/test-utils');

let geocoding;
beforeEach(() => {
  geocoding = geocodingService(tu.mockClient());
});

describe('forwardGeocode', () => {
  test('with minimal config', () => {
    geocoding.forwardGeocode({
      query: 'Tucson',
      mode: 'mapbox.places'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/geocoding/v5/:mode/:query.json',
      params: {
        query: 'Tucson',
        mode: 'mapbox.places'
      },
      query: {}
    });
  });

  test('with almost all config options, avoiding arrays when possible', () => {
    geocoding.forwardGeocode({
      query: 'Tucson',
      mode: 'mapbox.places-permanent',
      country: 'AO',
      proximity: [3, 4],
      types: ['country', 'region'],
      autocomplete: false,
      bbox: [1, 2, 3, 4],
      language: 'de'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/geocoding/v5/:mode/:query.json',
      params: {
        query: 'Tucson',
        mode: 'mapbox.places-permanent'
      },
      query: {
        country: 'AO',
        proximity: [3, 4],
        types: ['country', 'region'],
        autocomplete: false,
        bbox: [1, 2, 3, 4],
        language: 'de'
      }
    });
  });

  test('with all config options, using arrays when possible', () => {
    geocoding.forwardGeocode({
      query: 'Tucson',
      mode: 'mapbox.places-permanent',
      country: ['AO', 'AR'],
      proximity: [3, 4],
      types: ['country', 'region'],
      autocomplete: true,
      bbox: [1, 2, 3, 4],
      limit: 3,
      language: ['de', 'bs']
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/geocoding/v5/:mode/:query.json',
      params: {
        query: 'Tucson',
        mode: 'mapbox.places-permanent'
      },
      query: {
        country: ['AO', 'AR'],
        proximity: [3, 4],
        types: ['country', 'region'],
        autocomplete: true,
        bbox: [1, 2, 3, 4],
        limit: 3,
        language: ['de', 'bs']
      }
    });
  });
});

describe('reverseGeocode', () => {
  test('with minimal config', () => {
    geocoding.reverseGeocode({
      query: [15, 14],
      mode: 'mapbox.places'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/geocoding/v5/:mode/:query.json',
      params: {
        query: [15, 14],
        mode: 'mapbox.places'
      },
      query: {}
    });
  });

  test('with almost all config options, avoiding arrays when possible', () => {
    geocoding.reverseGeocode({
      query: [15, 14],
      mode: 'mapbox.places-permanent',
      country: 'AO',
      types: ['country', 'region'],
      autocomplete: false,
      bbox: [1, 2, 3, 4],
      limit: 3,
      language: 'de'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/geocoding/v5/:mode/:query.json',
      params: {
        query: [15, 14],
        mode: 'mapbox.places-permanent'
      },
      query: {
        country: 'AO',
        types: ['country', 'region'],
        bbox: [1, 2, 3, 4],
        limit: 3,
        language: 'de'
      }
    });
  });

  test('with all config options, using arrays when possible', () => {
    geocoding.reverseGeocode({
      query: [15, 14],
      mode: 'mapbox.places-permanent',
      country: ['AO', 'AR'],
      types: ['country', 'region'],
      bbox: [1, 2, 3, 4],
      limit: 3,
      language: ['de', 'bs'],
      reverseMode: 'distance'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/geocoding/v5/:mode/:query.json',
      params: {
        query: [15, 14],
        mode: 'mapbox.places-permanent'
      },
      query: {
        country: ['AO', 'AR'],
        types: ['country', 'region'],
        bbox: [1, 2, 3, 4],
        limit: 3,
        language: ['de', 'bs'],
        reverseMode: 'distance'
      }
    });
  });
});
