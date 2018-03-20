'use strict';

var invariant = require('../../vendor/invariant');
var makeService = require('../make_service');

/**
 * @class MapboxTilestats
 */
var MapboxTilestats = module.exports = makeService('MapboxTilestats');

var API_TILESTATS_STATISTICS = '/tilestats/v1/{owner}/{tileset}{?access_token}';

/**
 * To retrieve statistics about a specific tileset.
 *
 * @param {String} tileset - the id for the tileset
 * @param {Function} callback called with (err, tilestats)
 * @returns {Promise} response
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestats('tileset-id', function(err, info) {
 *   console.log(info);
 *   // {
 *   //   "layerCount": {layer count},
 *   //   "layers": [
 *   //     {
 *   //       "layer": {layer name},
 *   //       "geometry": {dominant geometry},
 *   //       "count": {feature count},
 *   //       "attributeCount": {attribute count}
 *   //       "attributes": [
 *   //         {
 *   //           "attribute": {attribute name},
 *   //           "type": {attribute type},
 *   //           "count": {unique value count},
 *   //           "min": {minimum value if type is number},
 *   //           "max": {maximum value if type is number},
 *   //           "values": [{...unique values}]
 *   //         }
 *   //       ]
 *   //     }
 *   //   ]
 *   // }
 * });
 */
MapboxTilestats.prototype.getTilestats = function(tileset, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    callback: callback
  });
};


/**
 * To create or update statistics about a specific tileset.
 *
 * @param {String} tileset - the id for the tileset
 * @param {object} statistics - the statistics to upload
 * @param {Function} callback called with (err, tilestats)
 * @returns {Promise} response
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestats('tileset-id', function(err, stats) {
 *   console.log(stats);
 *   // {
 *   //   "account": {account}
 *   //   ... see stats example above (for Tilestats#getTilestats)
 *   // }
 * });
 */
MapboxTilestats.prototype.putTilestats = function(tileset, statistics, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    entity: statistics,
    method: 'put',
    callback: callback
  });
};
