'use strict';

var xtend = require('xtend');
var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var stringifyBooleans = require('./service-helpers/stringify-booleans');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Geocoding API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/search/#geocoding).
 */
var Geocoding = {};

var featureTypes = [
  'country',
  'region',
  'postcode',
  'district',
  'place',
  'locality',
  'neighborhood',
  'address',
  'poi',
  'poi.landmark'
];

/**
 * Search for a place.
 *
 * See the [public documentation](https://docs.mapbox.com/api/search/#forward-geocoding).
 *
 * @param {Object} config
 * @param {string} config.query - A place name.
 * @param {'mapbox.places'|'mapbox.places-permanent'} [config.mode="mapbox.places"] - Either `mapbox.places` for ephemeral geocoding, or `mapbox.places-permanent` for storing results and batch geocoding.
 * @param {Array<string>} [config.countries] - Limits results to the specified countries.
 *   Each item in the array should be an [ISO 3166 alpha 2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
 * @param {Coordinates} [config.proximity] - Bias local results based on a provided location.
 * @param {Array<'country'|'region'|'postcode'|'district'|'place'|'locality'|'neighborhood'|'address'|'poi'|'poi.landmark'>} [config.types] - Filter results by feature types.
 * @param {boolean} [config.autocomplete=true] - Return autocomplete results or not.
 * @param {BoundingBox} [config.bbox] - Limit results to a bounding box.
 * @param {number} [config.limit=5] - Limit the number of results returned.
 * @param {Array<string>} [config.language] - Specify the language to use for response text and, for forward geocoding, query result weighting.
 *  Options are [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) comprised of a mandatory
 *  [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and optionally one or more IETF subtags for country or script.
 * @param {boolean} [config.routing] - Specify whether to request additional metadata about the recommended navigation destination. Only applicable for address features.
 * @return {MapiRequest}
 *
 * @example
 * geocodingClient.forwardGeocode({
 *   query: 'Paris, France',
 *   limit: 2
 * })
 *   .send()
 *   .then(response => {
 *     const match = response.body;
 *   });
 *
 * @example
 * // geocoding with proximity
 * geocodingClient.forwardGeocode({
 *   query: 'Paris, France',
 *   proximity: [-95.4431142, 33.6875431]
 * })
 *   .send()
 *   .then(response => {
 *     const match = response.body;
 *   });
 *
 * // geocoding with countries
 * geocodingClient.forwardGeocode({
 *   query: 'Paris, France',
 *   countries: ['fr']
 * })
 *   .send()
 *   .then(response => {
 *     const match = response.body;
 *   });
 *
 * // geocoding with bounding box
 * geocodingClient.forwardGeocode({
 *   query: 'Paris, France',
 *   bbox: [2.14, 48.72, 2.55, 48.96]
 * })
 *   .send()
 *   .then(response => {
 *     const match = response.body;
 *   });
 */
Geocoding.forwardGeocode = function(config) {
  v.assertShape({
    query: v.required(v.string),
    mode: v.oneOf('mapbox.places', 'mapbox.places-permanent'),
    countries: v.arrayOf(v.string),
    proximity: v.coordinates,
    types: v.arrayOf(v.oneOf(featureTypes)),
    autocomplete: v.boolean,
    bbox: v.arrayOf(v.number),
    limit: v.number,
    language: v.arrayOf(v.string),
    routing: v.boolean
  })(config);

  config.mode = config.mode || 'mapbox.places';

  var query = stringifyBooleans(
    xtend(
      { country: config.countries },
      pick(config, [
        'proximity',
        'types',
        'autocomplete',
        'bbox',
        'limit',
        'language',
        'routing'
      ])
    )
  );

  return this.client.createRequest({
    method: 'GET',
    path: '/geocoding/v5/:mode/:query.json',
    params: pick(config, ['mode', 'query']),
    query: query
  });
};

/**
 * Search for places near coordinates.
 *
 * See the [public documentation](https://docs.mapbox.com/api/search/#reverse-geocoding).
 *
 * @param {Object} config
 * @param {Coordinates} config.query - Coordinates at which features will be searched.
 * @param {'mapbox.places'|'mapbox.places-permanent'} [config.mode="mapbox.places"] - Either `mapbox.places` for ephemeral geocoding, or `mapbox.places-permanent` for storing results and batch geocoding.
 * @param {Array<string>} [config.countries] - Limits results to the specified countries.
 *   Each item in the array should be an [ISO 3166 alpha 2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
 * @param {Array<'country'|'region'|'postcode'|'district'|'place'|'locality'|'neighborhood'|'address'|'poi'|'poi.landmark'>} [config.types] - Filter results by feature types.
 * @param {BoundingBox} [config.bbox] - Limit results to a bounding box.
 * @param {number} [config.limit=1] - Limit the number of results returned. If using this option, you must provide a single item for `types`.
 * @param {Array<string>} [config.language] - Specify the language to use for response text and, for forward geocoding, query result weighting.
 *  Options are [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) comprised of a mandatory
 *  [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and optionally one or more IETF subtags for country or script.
 * @param {'distance'|'score'} [config.reverseMode='distance'] - Set the factors that are used to sort nearby results.
 * @param {boolean} [config.routing] - Specify whether to request additional metadata about the recommended navigation destination. Only applicable for address features.
 * @return {MapiRequest}
 *
 * @example
 * geocodingClient.reverseGeocode({
 *   query: [-95.4431142, 33.6875431]
 * })
 *   .send()
 *   .then(response => {
 *     // GeoJSON document with geocoding matches
 *     const match = response.body;
 *   });
 */
Geocoding.reverseGeocode = function(config) {
  v.assertShape({
    query: v.required(v.coordinates),
    mode: v.oneOf('mapbox.places', 'mapbox.places-permanent'),
    countries: v.arrayOf(v.string),
    types: v.arrayOf(v.oneOf(featureTypes)),
    bbox: v.arrayOf(v.number),
    limit: v.number,
    language: v.arrayOf(v.string),
    reverseMode: v.oneOf('distance', 'score'),
    routing: v.boolean
  })(config);

  config.mode = config.mode || 'mapbox.places';

  var query = stringifyBooleans(
    xtend(
      { country: config.countries },
      pick(config, [
        'country',
        'types',
        'bbox',
        'limit',
        'language',
        'reverseMode',
        'routing'
      ])
    )
  );

  return this.client.createRequest({
    method: 'GET',
    path: '/geocoding/v5/:mode/:query.json',
    params: pick(config, ['mode', 'query']),
    query: query
  });
};

module.exports = createServiceFactory(Geocoding);
