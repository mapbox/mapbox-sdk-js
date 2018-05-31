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
Geocoding.forwardGeocode = function(config) {
  v.assertShape({
    query: v.required(v.string),
    mode: v.required(v.oneOf('mapbox.places', 'mapbox.places-permanent')),
    country: v.oneOfType(v.string, v.arrayOf(v.string)),
    proximity: v.coordinates,
    types: v.arrayOf(v.string),
    autocomplete: v.boolean,
    bbox: v.arrayOf(v.number),
    limit: v.number,
    language: v.oneOfType(v.string, v.arrayOf(v.string))
  })(config);

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
 * @param {[longitude, latitude]} config.query - `[longitude, latitude]`
 * @param {'mapbox.places'|'mapbox.places-permanent'} config.mode
 * @param {string|Array<string>} [config.country]
 * @param {Array<string>} [config.types]
 * @param {[longitude, latitude, longitude, latitude]} [config.bbox] - `[minX, minY, maxX, maxY]`
 * @param {number} [config.limit=1] - If using this option, you must provide a single item for `types`.
 * @param {string|Array<string>} [config.language]
 * @param {'distance'|'score'} [config.reverseMode='distance']
 * @return {MapiRequest}
 */
Geocoding.reverseGeocode = function(config) {
  v.assertShape({
    query: v.required(v.coordinates),
    mode: v.required(v.oneOf('mapbox.places', 'mapbox.places-permanent')),
    country: v.oneOfType(v.string, v.arrayOf(v.string)),
    types: v.arrayOf(v.string),
    bbox: v.arrayOf(v.number),
    limit: v.number,
    language: v.oneOfType(v.string, v.arrayOf(v.string)),
    reverseMode: v.oneOf('distance', 'score')
  })(config);

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
