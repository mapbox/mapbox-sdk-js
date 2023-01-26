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
 * [the HTTP service documentation](https://docs.mapbox.com/api/search/geocoding-v6/).
 */
var GeocodingV6 = {};

var featureTypes = [
  'street',
  'country',
  'region',
  'postcode',
  'district',
  'place',
  'locality',
  'neighborhood',
  'address'
];

/**
 * Search for a place.
 *
 * See the [public documentation](https://docs.mapbox.com/api/search/geocoding-v6/#forward-geocoding).
 *
 * @param {Object} config
 * @param {string} config.query - A place name.
 * @param {'standard'|'structured'} [config.mode="standard"] - Either `standard` for common forward geocoding, or `structured` for increasing the accuracy of results. To use Structured Input, the query parameter must be dropped in favor of a separate parameter for individual feature components.
 * @param {Array<string>|string} [config.countries] - Limits results to the specified countries.
 *   Each item in the array should be an [ISO 3166 alpha 2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
 *   [OR] if used with input mode="structured" denotes single country in free form.
 * @param {Coordinates|'ip'} [config.proximity] - Bias local results based on a provided coordinate location or a user's IP address.
 * @param {Array<'street'|'country'|'region'|'postcode'|'district'|'place'|'locality'|'neighborhood'|'address'>} [config.types] - Filter results by feature types.
 * @param {BoundingBox} [config.bbox] - Limit results to a bounding box.
 * @param {number} [config.limit=5] - Limit the number of results returned.
 * @param {'geojson'|'v5'} [config.format='geojson'] - Specify the desired response format of results (geojson, default) or for backwards compatibility (v5).
 * @param {String} [config.language] - Specify the language to use for response text and, for forward geocoding, query result weighting.
 *  Options are [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) comprised of a mandatory
 *  [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and optionally one or more IETF subtags for country or script.
 * @param {String} [config.address_line1] - A string including address_number and street. These values can alternatively be provided as separate parameters. (Stuctured Input specific field)
 * @param {String} [config.address_number] - The number associated with the house (Stuctured Input specific field)
 * @param {String} [config.street] - The name of the street in the address (Stuctured Input specific field)
 * @param {String} [config.block] - In some countries like Japan, the block is a component in the address (Stuctured Input specific field)
 * @param {String} [config.place] - Typically these are cities, villages, municipalities, etc. (Stuctured Input specific field)
 * @param {String} [config.region] - Top-level sub-national administrative features, such as states in the United States or provinces in Canada or China. (Stuctured Input specific field)
 * @param {String} [config.neighborhood] - Colloquial sub-city features often referred to in local parlance (Stuctured Input specific field)
 * @param {String} [config.postcode] - Postal codes used in country-specific national addressing systems. (Stuctured Input specific field)
 * @param {String} [config.locality] - Official sub-city features (Stuctured Input specific field)
 * @param {boolean} [config.autocomplete=true] - Return autocomplete results or not.
 * @param {boolean} [config.permanent=false] - Specify whether you intend to store the results of the query (true) or not (false, default). Temporary results are not allowed to be cached, while Permanent results are allowed to be cached and stored indefinitely.
 * @param {String} [config.worldview="us"] - Filter results to geographic features whose characteristics are defined differently by audiences belonging to various regional, cultural, or political groups.
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
 * // geocoding in structured input mode
 * geocodingClient.forwardGeocode({
 *   mode: 'structured',
 *   address_number: '12',
 *   street: 'Main str.'
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
GeocodingV6.forwardGeocode = function(config) {
  config.mode = config.mode || 'standard';

  v.assertShape(
    xtend(config.mode === 'standard' ? { query: v.required(v.string) } : {}, {
      mode: v.oneOf('standard', 'structured'),
      countries: config.mode === 'standard' ? v.arrayOf(v.string) : v.string,
      proximity: v.oneOf(v.coordinates, 'ip'),
      types: v.arrayOf(v.oneOf(featureTypes)),
      bbox: v.arrayOf(v.number),
      format: v.oneOf('geojson', 'v5'),
      language: v.string,
      limit: v.number,
      worldview: v.string,
      autocomplete: v.boolean,
      permanent: v.boolean,

      // structured input fields
      address_line1: v.string,
      address_number: v.string,
      street: v.string,
      block: v.string,
      place: v.string,
      region: v.string,
      neighborhood: v.string,
      postcode: v.string,
      locality: v.string
    })
  )(config);

  var query = stringifyBooleans(
    xtend(
      config.mode === 'standard'
        ? { q: config.query }
        : pick(config, [
            'address_line1',
            'address_number',
            'street',
            'block',
            'place',
            'region',
            'neighborhood',
            'postcode',
            'locality'
          ]),
      { country: config.countries },
      pick(config, [
        'proximity',
        'types',
        'bbox',
        'format',
        'language',
        'limit',
        'worldview',
        'autocomplete',
        'permanent'
      ])
    )
  );

  return this.client.createRequest({
    method: 'GET',
    path: '/search/geocode/v6/forward',
    query: query
  });
};

/**
 * Search for places near coordinates.
 *
 * See the [public documentation](https://docs.mapbox.com/api/search/geocoding-v6/#reverse-geocoding).
 *
 * @param {Object} config
 * @param {number} config.longitude - longitude coordinate at which features will be searched.
 * @param {number} config.latitude - latitude coordinate at which features will be searched.
 * @param {Array<string>} [config.countries] - Limits results to the specified countries.
 *   Each item in the array should be an [ISO 3166 alpha 2 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
 * @param {Array<'street'|'country'|'region'|'postcode'|'district'|'place'|'locality'|'neighborhood'|'address'>} [config.types] - Filter results by feature types.
 * @param {BoundingBox} [config.bbox] - Limit results to a bounding box.
 * @param {number} [config.limit=1] - Limit the number of results returned. If using this option, you must provide a single item for `types`.
 * @param {string} [config.language] - Specify the language to use for response text and, for forward geocoding, query result weighting.
 *  Options are [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) comprised of a mandatory
 *  [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and optionally one or more IETF subtags for country or script.
 * @param {boolean} [config.permanent=false] - Specify whether you intend to store the results of the query (true) or not (false, default). Temporary results are not allowed to be cached, while Permanent results are allowed to be cached and stored indefinitely.
 * @param {String} [config.worldview="us"] - Filter results to geographic features whose characteristics are defined differently by audiences belonging to various regional, cultural, or political groups.
 * @return {MapiRequest}
 *
 * @example
 * geocodingClient.reverseGeocode({
 *   longitude: -73.990593,
 *   latitude: 40.740121
 * })
 *   .send()
 *   .then(response => {
 *     // GeoJSON document with geocoding matches
 *     const match = response.body;
 *   });
 */
GeocodingV6.reverseGeocode = function(config) {
  v.assertShape({
    longitude: v.required(v.number),
    latitude: v.required(v.number),
    countries: v.arrayOf(v.string),
    types: v.arrayOf(v.oneOf(featureTypes)),
    limit: v.number,
    language: v.string,
    worldview: v.string,
    permanent: v.boolean,
  })(config);

  var query = stringifyBooleans(
    xtend(
      { country: config.countries },
      pick(config, [
        'longitude',
        'latitude',
        'types',
        'limit',
        'language',
        'worldview',
        'permanent'
      ])
    )
  );

  return this.client.createRequest({
    method: 'GET',
    path: '/search/geocode/v6/reverse',
    query: query
  });
};

module.exports = createServiceFactory(GeocodingV6);
