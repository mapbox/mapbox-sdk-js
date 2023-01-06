'use strict';

const geocodingService = require('../geocoding-v6');
const tu = require('../../test/test-utils');

let geocoding;
beforeEach(() => {
  geocoding = geocodingService(tu.mockClient());
});

describe('forwardGeocode', () => {
  test('with minimal config', () => {
    geocoding.forwardGeocode({
      query: 'Tucson'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/geocode/v6/forward',
      query: { q: 'Tucson' }
    });
  });

  test('normal mode with all config options', () => {
    geocoding.forwardGeocode({
      query: 'Tucson',
      mode: 'normal',
      countries: ['AO', 'AR'],
      proximity: [3, 4],
      types: ['country', 'region'],
      autocomplete: true,
      bbox: [1, 2, 3, 4],
      limit: 3,
      language: 'de',
      worldview: 'us',

      // structured input parameters will be ignored in normal mode
      address_number: '12',
      street: 'Main',
      place: 'some place',
      region: 'region',
      country: 'country',
      postcode: '1234',
      locality: 'locality'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/geocode/v6/forward',
      query: {
        q: 'Tucson',
        country: ['AO', 'AR'],
        proximity: [3, 4],
        types: ['country', 'region'],
        autocomplete: 'true',
        bbox: [1, 2, 3, 4],
        limit: 3,
        language: 'de',
        worldview: 'us'
      }
    });
  });

  test('structured input mode with all config options', () => {
    geocoding.forwardGeocode({
      query: 'Tucson', // will be ignored
      mode: 'structured',
      countries: ['AO', 'AR'],
      proximity: [3, 4],
      types: ['country', 'region'],
      autocomplete: true,
      bbox: [1, 2, 3, 4],
      limit: 3,
      language: 'de',
      worldview: 'us',

      // structured input parameters will be picked
      address_number: '12',
      street: 'Main',
      place: 'some place',
      region: 'region',
      country: 'country',
      postcode: '1234',
      locality: 'locality'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/geocode/v6/forward',
      query: {
        proximity: [3, 4],
        types: ['country', 'region'],
        autocomplete: 'true',
        bbox: [1, 2, 3, 4],
        limit: 3,
        language: 'de',
        worldview: 'us',

        address_number: '12',
        street: 'Main',
        place: 'some place',
        region: 'region',
        country: 'country',
        postcode: '1234',
        locality: 'locality'
      }
    });
  });
});

describe('reverseGeocode', () => {
  test('with minimal config', () => {
    geocoding.reverseGeocode({
      longitude: 15,
      latitude: 14
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: 'geocode/v6/reverse',
      query: {
        longitude: 15,
        latitude: 14
      }
    });
  });

  test('with all config options', () => {
    geocoding.reverseGeocode({
      longitude: 15,
      latitude: 14,
      countries: ['AO', 'AR'],
      types: ['country', 'region'],
      bbox: [1, 2, 3, 4],
      limit: 3,
      language: 'de',
      worldview: 'us'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: 'geocode/v6/reverse',
      query: {
        longitude: 15,
        latitude: 14,
        country: ['AO', 'AR'],
        types: ['country', 'region'],
        bbox: [1, 2, 3, 4],
        limit: 3,
        language: 'de',
        worldview: 'us'
      }
    });
  });
});
