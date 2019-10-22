'use strict';

var v = require('./service-helpers/validator');
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Tilequery API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/maps/#tilequery).
 */
var Tilequery = {};

/**
 * List features within a radius of a point on a map (or several maps).
 *
 * @param {Object} config
 * @param {Array<string>} config.mapIds - The maps being queried.
 *   If you need to composite multiple layers, provide multiple map IDs.
 * @param {Coordinates} config.coordinates - The longitude and latitude to be queried.
 * @param {number} [config.radius=0] - The approximate distance in meters to query for features.
 * @param {number} [config.limit=5] - The number of features to return, between 1 and 50.
 * @param {boolean} [config.dedupe=true] - Whether or not to deduplicate results.
 * @param {'polygon'|'linestring'|'point'} [config.geometry] - Queries for a specific geometry type.
 * @param {Array<string>} [config.layers] - IDs of vector layers to query.
 * @return {MapiRequest}
 *
 * @example
 * tilequeryClient.listFeatures({
 *   mapIds: ['mapbox.mapbox-streets-v8'],
 *   coordinates: [-122.42901, 37.80633],
 *   radius: 10
 * })
 *   .send()
 *   .then(response => {
 *     const features = response.body;
 *   });
 */
Tilequery.listFeatures = function(config) {
  v.assertShape({
    mapIds: v.required(v.arrayOf(v.string)),
    coordinates: v.required(v.coordinates),
    radius: v.number,
    limit: v.range([1, 50]),
    dedupe: v.boolean,
    geometry: v.oneOf('polygon', 'linestring', 'point'),
    layers: v.arrayOf(v.string)
  })(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/v4/:mapIds/tilequery/:coordinates.json',
    params: {
      mapIds: config.mapIds,
      coordinates: config.coordinates
    },
    query: pick(config, ['radius', 'limit', 'dedupe', 'layers', 'geometry'])
  });
};

module.exports = createServiceFactory(Tilequery);
