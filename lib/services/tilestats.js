'use strict';

var invariant = require('../../vendor/invariant'),
  makeService = require('../make_service'),
  constants = require('../constants');

var Tilestats = module.exports = makeService('MapboxTilestats');

/**
 * To create an empty set of tileset statistics.
 *
 * @private
 * @param {String} tileset - the id for the tileset
 * @param {Array<string>} layers - an array of layer names in the tileset
 * @param {Function} callback called with (err, tilestats)
 * @returns {undefined} nothing, calls callback
 */
Tilestats.prototype.createTilestats = function(tileset, layers, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');
  invariant(Array.isArray(layers), 'layers must be an array');
  invariant(layers.every(function(layer) {
    return typeof layer === 'string';
  }), 'layers must be an array of strings');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: constants.API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    entity: { layers: layers },
    method: 'post',
    callback: callback
  }).entity();
};

/**
 * To delete a set of tileset statistics.
 *
 * @private
 * @param {String} tileset - the id for the tileset
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 */
Tilestats.prototype.deleteTilestats = function(tileset, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: constants.API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    method: 'delete',
    callback: callback
  }).entity();
};

/**
 * To retrieve statistics about a specific tileset.
 *
 * @param {String} tileset - the id for the tileset
 * @param {Function} callback called with (err, tilestats)
 * @returns {undefined} nothing, calls callback
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestats('tileset-id', function(err, info) {
 *   console.log(info);
 *   // {
 *   //   "account": {account},
 *   //   "tilesetid": "tileset-id",
 *   //   "layers": [
 *   //     {
 *   //       "account": {account},
 *   //       "tilesetid": "tileset-id",
 *   //       "layer": {layername},
 *   //       "count": 10,
 *   //       "attributes": [
 *   //         {
 *   //           "attribute": {attributename},
 *   //           "min": 0,
 *   //           "max": 10,
 *   //           "values": [0, 10]
 *   //         }
 *   //       ]
 *   //     }
 *   //   ]
 *   // }
 * });
 */
Tilestats.prototype.getTilestats = function(tileset, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: constants.API_TILESTATS_STATISTICS,
    params: {
      owner: owner,
      tileset: tileset
    },
    callback: callback
  }).entity();
};

/**
 * Add or update information about geometry types present in a tileset layer.
 * This request may be made multiple times against a single layer, in order to
 * update the total geometry counts across a set of parallel tileset reads.
 *
 * @private
 * @param {String} tileset - the id for the tileset
 * @param {String} layer - the name of the layer in the tileset
 * @param {Object} geometries - an object indicating the number of features present
 * in the layer of various geometry types.
 * @param {Number} [geometries.point] - number of Point features
 * @param {Number} [geometries.multipoint] - number of MultiPoint features
 * @param {Number} [geometries.linestring] - number of LineString features
 * @param {Number} [geometries.multilinestring] - number of MultiLineString features
 * @param {Number} [geometries.polygon] - number of Polygon features
 * @param {Number} [geometries.multipolygon] - number of MultiPolygon features
 * @param {Number} [geometries.geometrycollection] - number of GeometryCollection features
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 */
Tilestats.prototype.updateTilestatsLayer = function(tileset, layer, geometries, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');
  invariant(typeof layer === 'string', 'layer must be a string');
  invariant(typeof geometries === 'object', 'geometries must be an object');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: constants.API_TILESTATS_LAYER,
    params: {
      owner: owner,
      tileset: tileset,
      layer: layer
    },
    entity: geometries,
    method: 'post',
    callback: callback
  }).entity();
};

/**
 * To add or update statistics about the values of a particular attribute in
 * a layer. This request may be made multiple times against a single attribute,
 * in order to update the statistics across a set of parallel tileset reads.
 *
 * @private
 * @param {String} tileset - the id for the tileset
 * @param {String} layer - the name of the layer in the tileset
 * @param {String} attribute - the name of the attribute in the layer
 * @param {Object} stats - statistics about attribute values in the layer
 * @param {Number|String} stats.min - the minimum attribute value
 * @param {Number|String} stats.max - the maximum attribute value
 * @param {Array<Number|String>} stats.values - an array of unique values for the attribute
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 */
Tilestats.prototype.updateTilestatsAttribute = function(tileset, layer, attribute, stats, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');
  invariant(typeof layer === 'string', 'layer must be a string');
  invariant(typeof attribute === 'string', 'attribute must be a string');
  invariant(typeof stats === 'object', 'stats must be an object');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: constants.API_TILESTATS_ATTRIBUTE,
    params: {
      owner: owner,
      tileset: tileset,
      layer: layer,
      attribute: attribute
    },
    entity: stats,
    method: 'post',
    callback: callback
  }).entity();
};

/**
 * To retrieve statistics about the attribute values of a particular attribute
 * within a tileset layer.
 *
 * @param {String} tileset - the id for the tileset
 * @param {String} layer - the name of the layer in the tileset
 * @param {String} attribute - the name of the attribute in the layer
 * @param {Function} callback called with (err)
 * @returns {undefined} nothing, calls callback
 * @example
 * var client = new MapboxClient('ACCESSTOKEN');
 * client.getTilestatsAttribute('tileset-id', 'layer-name', 'attr-name', function(err, info) {
 *   console.log(info);
 *   // {
 *   //   "account": {account},
 *   //   "tilesetid": "tileset-id",
 *   //   "layer": "layer-name",
 *   //   "attribute": "attr-name",
 *   //   "type": "Number",
 *   //   "min": 0,
 *   //   "max": 10,
 *   //   "values": [
 *   //     0,
 *   //     10
 *   //   ]
 *   // }
 * });
 */
Tilestats.prototype.getTilestatsAttribute = function(tileset, layer, attribute, callback) {
  invariant(typeof tileset === 'string', 'tileset must be a string');
  invariant(typeof layer === 'string', 'layer must be a string');
  invariant(typeof attribute === 'string', 'attribute must be a string');

  var owner = tileset.split('.')[0];
  if (owner === tileset) owner = this.owner;

  return this.client({
    path: constants.API_TILESTATS_ATTRIBUTE,
    params: {
      owner: owner,
      tileset: tileset,
      layer: layer,
      attribute: attribute
    },
    callback: callback
  }).entity();
};
