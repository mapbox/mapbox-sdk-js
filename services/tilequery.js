'use strict';

var v = require('./service-helpers/validator').v;
var pick = require('./service-helpers/pick');
var createServiceFactory = require('./service-helpers/create-service-factory');

/**
 * Tilequery API service.
 */
var Tilequery = {};

/**
 * List features within a radius of a point on a map (or several maps).
 *
 * See the [public documentation](https://www.mapbox.com/api-documentation/#tilequery).
 *
 * @param {Object} config
 * @param {string|Array<string>} config.mapId
 * @param {number} config.longitude
 * @param {number} config.latitude
 * @param {number} [config.radius=0] - The approximate distance in meters to query for features.
 * @param {number} [config.limit=5] - The number of features to return, between 1 and 50.
 * @param {boolean} [config.dedupe=true] - Whether or not to deduplicate results.
 * @param {'polygon'|'linestring'|'point'} [config.geometry] - Search only for the specified
 *   geometry types.
 * @param {Array<string>} [config.layers] - IDs of vector layers to query.
 * @return {MapiRequest}
 */
Tilequery.listFeatures = function(config) {
  v.warn(
    v.shapeOf({
      mapId: v.required(v.oneOfType(v.string, v.arrayOf(v.string))),
      longitude: v.required(v.number),
      latitude: v.required(v.number),
      radius: v.number,
      limit: v.number,
      dedupe: v.boolean,
      layers: v.arrayOf(v.string)
    })
  )(config);

  return this.client.createRequest({
    method: 'GET',
    path: '/v4/:mapIds/tilequery/:coordinates.json',
    params: {
      mapIds: [].concat(config.mapId),
      coordinates: [config.longitude, config.latitude]
    },
    query: pick(config, ['radius', 'limit', 'dedupe', 'layers'])
  });
};

module.exports = createServiceFactory(Tilequery);
