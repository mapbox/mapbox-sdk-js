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
      path: '/search/geocode/v6/forward',
      query: { q: 'Tucson' }
    });
  });

  test('standard mode with all config options', () => {
    geocoding.forwardGeocode({
      query: 'Tucson',
      mode: 'standard',
      countries: ['AO', 'AR'],
      proximity: [3, 4],
      types: ['street', 'country', 'region', 'address', 'secondary_address'],
      autocomplete: true,
      bbox: [1, 2, 3, 4],
      format: 'v5',
      limit: 3,
      language: 'de',
      worldview: 'us',
      permanent: true,
      session_token: 'abc123',

      // structured input parameters will be ignored in normal mode
      address_line1: '12 main',
      address_number: '12',
      street: 'Main',
      block: 'block',
      place: 'some place',
      region: 'region',
      neighborhood: 'neighborhood',
      postcode: '1234',
      locality: 'locality'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/search/geocode/v6/forward',
      query: {
        q: 'Tucson',
        country: ['AO', 'AR'],
        proximity: [3, 4],
        types: ['street', 'country', 'region', 'address', 'secondary_address'],
        autocomplete: 'true',
        bbox: [1, 2, 3, 4],
        format: 'v5',
        limit: 3,
        language: 'de',
        worldview: 'us',
        permanent: 'true',
        session_token: 'abc123'
      }
    });
  });

  test('structured input mode with all config options', () => {
    geocoding.forwardGeocode({
      mode: 'structured',
      countries: 'AO',
      proximity: [3, 4],
      types: ['street', 'country', 'region'],
      autocomplete: true,
      bbox: [1, 2, 3, 4],
      limit: 3,
      language: 'de',
      worldview: 'us',
      session_token: 'abc123',

      // structured input parameters will be picked
      address_line1: '12 main',
      address_number: '12',
      street: 'Main',
      block: 'block',
      place: 'some place',
      region: 'region',
      neighborhood: 'neighborhood',
      postcode: '1234',
      locality: 'locality'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/search/geocode/v6/forward',
      query: {
        proximity: [3, 4],
        types: ['street', 'country', 'region'],
        autocomplete: 'true',
        bbox: [1, 2, 3, 4],
        limit: 3,
        language: 'de',
        worldview: 'us',
        session_token: 'abc123',

        address_line1: '12 main',
        address_number: '12',
        street: 'Main',
        block: 'block',
        place: 'some place',
        region: 'region',
        neighborhood: 'neighborhood',
        country: 'AO',
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
      path: '/search/geocode/v6/reverse',
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
      limit: 3,
      language: 'de',
      worldview: 'us',
      permanent: true,
      session_token: 'abc123'
    });
    expect(tu.requestConfig(geocoding)).toEqual({
      method: 'GET',
      path: '/search/geocode/v6/reverse',
      query: {
        longitude: 15,
        latitude: 14,
        country: ['AO', 'AR'],
        types: ['country', 'region'],
        limit: 3,
        language: 'de',
        worldview: 'us',
        permanent: 'true',
        session_token: 'abc123'
      }
    });
  });
});
