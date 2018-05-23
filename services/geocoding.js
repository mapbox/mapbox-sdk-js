'use strict';

var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Geocoding API service.
 */
var Geocoding = {};

/**
 * Search for a place.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#search-for-places).
 *
 * @param {Object} config
 * @param {string} config.query - A place name.
 * @param {'mapbox.places'|'mapbox.places-permanent'} config.mode
 * @param {string|Array<string>} [config.country]
 * @param {[number, number]} [config.proximity] - `[longitude, latitude]`
 * @param {Array<string>} [config.types]
 * @param {boolean} [config.autocomplete=true]
 * @param {[number, number, number, number]} [config.bbox] - `[minX, minY, maxX, maxY]`
 * @param {number} [config.limit=5]
 * @param {string|Array<string>} [config.language]
 * @return {MapiRequest}
 */
Geocoding.geocodeForward = function(config) {
  v.validate(
    {
      query: v.string.required,
      mode: v.oneOf('mapbox.places', 'mapbox.places-permanent').required,
      country: v.stringOrArrayOfStrings,
      proximity: v.arrayOf(v.number),
      types: v.arrayOfStrings,
      autocomplete: v.boolean,
      bbox: v.arrayOf(v.number),
      limit: v.number,
      language: v.stringOrArrayOfStrings
    },
    config
  );

  return this.client.createRequest({
    method: 'GET',
    path: '/geocoding/v5/:mode/:query.json',
    params: pick(config, ['mode', 'query']),
    query: pick(config, [
      'country',
      'proximity',
      'types',
      'autocomplete',
      'bbox',
      'limit',
      'language'
    ])
  });
};

/**
 * Search for places near coordinates.
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#retrieve-places-near-a-location).
 *
 * @param {Object} config
 * @param {[number, number]} config.query - `[longitude, latitude]`
 * @param {'mapbox.places'|'mapbox.places-permanent'} config.mode
 * @param {string|Array<string>} [config.country]
 * @param {Array<string>} [config.types]
 * @param {[number, number, number, number]} [config.bbox] - `[minX, minY, maxX, maxY]`
 * @param {number} [config.limit=1] - If using this option, you must provide a single item for `types`.
 * @param {string|Array<string>} [config.language]
 * @param {'distance'|'score'} [config.reverseMode='distance']
 * @return {MapiRequest}
 */
Geocoding.geocodeReverse = function(config) {
  v.validate(
    {
      query: v.arrayOf(v.number),
      mode: v.oneOf('mapbox.places', 'mapbox.places-permanent').required,
      country: v.stringOrArrayOfStrings,
      types: v.arrayOfStrings,
      bbox: v.arrayOf(v.number),
      limit: v.number,
      language: v.stringOrArrayOfStrings,
      reverseMode: v.oneOf('distance', 'score')
    },
    config
  );

  return this.client.createRequest({
    method: 'GET',
    path: '/geocoding/v5/:mode/:query.json',
    params: pick(config, ['mode', 'query']),
    query: pick(config, [
      'country',
      'types',
      'bbox',
      'limit',
      'language',
      'reverseMode'
    ])
  });
};

module.exports = createServiceFactory(Geocoding);
