'use strict';

var polyline = require('@mapbox/polyline');
var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var pick = require('./service-helpers/pick');

/**
 * Static Images API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://docs.mapbox.com/api/maps/#static-images).
 */
var Static = {};

/**
 * Get a static map image.
 *
 * **If you just want the URL for the static map image, create a request
 * and get it's URL with `MapiRequest#url`.** This is what prior versions of the
 * SDK returned.
 *
 * @param {Object} config
 * @param {string} config.ownerId - The owner of the map style.
 * @param {string} config.styleId - The map's style ID.
 * @param {number} config.width - Width of the image in pixels, between 1 and 1280.
 * @param {number} config.height - Height of the image in pixels, between 1 and 1280.
 * @param {'auto'|Object} config.position - If `"auto"`, the viewport will fit the bounds of the overlay(s).
 *  If an object, it could be either a bbox or a coordinate and a zoom as the required parameters.  
 *  ` bbox` (required): Is an array of coordinate pairs, with the first coordinate pair referring to the southwestern
 *  corner of the box (the minimum longitude and latitude) and the second referring to the northeastern corner of the box (the maximum longitude and latitude).
 *  Otherwise the maps' position is described by an object with the following properties:
 *   `coordinates` (required): [`coordinates`](#coordinates) for the center of image.
 *   `zoom` (required): Between 0 and 20.
 *   `bearing` (optional): Between 0 and 360.
 *   `pitch` (optional): Between 0 and 60.
 * @param {string} config.padding - A string value that denotes the minimum padding per side of the image. 
 *   This can only be used with auto or bbox. The value resembles the CSS specification for padding and accepts 1-4 integers without units
 *
 * @param {Array<Overlay>} [config.overlays] - Overlays should be in z-index
 *   order: the first in the array will be on the bottom; the last will be on
 *   the top. Overlays are objects that match one of the following types:
 *   [`SimpleMarkerOverlay`](#simplemarkeroverlay),
 *   [`CustomMarkerOverlay`](#custommarkeroverlay),
 *   [`PathOverlay`](#pathoverlay),
 *   [`GeoJsonOverlay`](#geojsonoverlay)
 *
 * @param {boolean} [config.highRes=false]
 * @param {string} [config.before_layer] - The ID of the style layer
 *   that overlays should be inserted *before*.
 * @param {Object} [config.addlayer] - Adds a Mapbox style layer to the map's style at render time. Can be combined with before_layer.
 * @param {Array} [config.setfilter] - Applies a filter to an existing layer in a style using Mapbox's expression syntax. Must be used with layer_id.
 * @param {string} [config.layer_id] - Denotes the layer in the style that the filter specified in setfilter is applied to.
 * @param {boolean} [config.attribution=true] - Whether there is attribution
 *   on the map image.
 * @param {boolean} [config.logo=true] - Whether there is a Mapbox logo
 *   on the map image.
 * @return {MapiRequest}
 *  
 * @example
 * staticClient.getStaticImage({
 *   ownerId: 'mapbox',
 *   styleId: 'streets-v11',
 *   width: 200,
 *   height: 300,
 *   position: {
 *     coordinates: [12, 13],
 *     zoom: 4
 *   }
 * })
 *   .send()
 *   .then(response => {
 *     const image = response.body;
 *   });
 * 
 * @example
 * staticClient.getStaticImage({
 *   ownerId: 'mapbox',
 *   styleId: 'streets-v11',
 *   width: 200,
 *   height: 300,
 *   position: {
 *     // position as a bounding box
 *     bbox: [-77.04,38.8,-77.02,38.91],
 *   }, 
 *  padding: '4'
 * })
 *   .send()
 *   .then(response => {
 *     const image = response.body;
 *   });
 *
 * @example
 * staticClient.getStaticImage({
 *   ownerId: 'mapbox',
 *   styleId: 'streets-v11',
 *   width: 200,
 *   height: 300,
 *   position: {
 *     coordinates: [12, 13],
 *     zoom: 3
 *   },
 *   overlays: [
 *     // Simple markers.
 *     {
 *       marker: {
 *         coordinates: [12.2, 12.8]
 *       }
 *     },
 *     {
 *       marker: {
 *         size: 'large',
 *         coordinates: [14, 13.2],
 *         label: 'm',
 *         color: '#000'
 *       }
 *     },
 *     {
 *       marker: {
 *         coordinates: [15, 15.2],
 *         label: 'airport',
 *         color: '#ff0000'
 *       }
 *     },
 *     // Custom marker
 *     {
 *       marker: {
 *         coordinates: [10, 11],
 *         url:  'https://upload.wikimedia.org/wikipedia/commons/6/6f/0xff_timetracker.png'
 *       }
 *     }
 *   ]
 * })
 *   .send()
 *   .then(response => {
 *     const image = response.body;
 *   });
 *
 * @example
 * // To get the URL instead of the image, create a request
 * // and get its URL without sending it.
 * const request = staticClient
 *   .getStaticImage({
 *     ownerId: 'mapbox',
 *     styleId: 'streets-v11',
 *     width: 200,
 *     height: 300,
 *     position: {
 *       coordinates: [12, 13],
 *       zoom: 4
 *     }
 *   });
 * const staticImageUrl = request.url();
 * // Now you can open staticImageUrl in a browser.
 *
 * @example
 * // Filter all buildings that have a height value that is less than 300 meters
 * const request = staticClient
 *   .getStaticImage({
 *     ownerId: 'mapbox',
 *     styleId: 'streets-v11',
 *     width: 200,
 *     height: 300,
 *     position: {
 *       coordinates: [12, 13],
 *       zoom: 4
 *     },
 *     setfilter: [">","height",300],
 *     layer_id: 'building',
 *   });
 * const staticImageUrl = request.url();
 * // Now you can open staticImageUrl in a browser.
 *
 * @example
 * // Paint all the state and province level boundaries associated with the US worldview with a dashed line and insert it below the road-label layer
 * const request = staticClient
 *   .getStaticImage({
 *     ownerId: 'mapbox',
 *     styleId: 'streets-v11',
 *     width: 200,
 *     height: 300,
 *     position: {
 *       coordinates: [12, 13],
 *       zoom: 4
 *     },
 *     addlayer: {"id":"better-boundary","type":"line","source":"composite","source-layer":"admin","filter":["all",["==",["get","admin_level"],1],["==",["get","maritime"],"false"],["match",["get","worldview"],["all","US"],true,false]],"layout":{"line-join":"bevel"},"paint":{"line-color":"%236898B3","line-width":1.5,"line-dasharray":[1.5,1]}},
 *    before_layer: 'road-label',
 *   });
 * const staticImageUrl = request.url();
 * // Now you can open staticImageUrl in a browser.

 */
Static.getStaticImage = function(config) {
  v.assertShape({
    ownerId: v.required(v.string),
    styleId: v.required(v.string),
    width: v.required(v.range([1, 1280])),
    height: v.required(v.range([1, 1280])),
    position: v.required(
      v.oneOfType(
        v.oneOf('auto'),
        v.strictShape({
          coordinates: v.required(v.coordinates),
          zoom: v.required(v.range([0, 20])),
          bearing: v.range([0, 360]),
          pitch: v.range([0, 60])
        }),
        v.strictShape({ bbox: v.required(v.arrayOf(v.number)) })
      )
    ),
    padding: v.string,
    overlays: v.arrayOf(v.plainObject),
    highRes: v.boolean,
    before_layer: v.string,
    addlayer: v.plainObject,
    setfilter: v.plainArray,
    layer_id: v.string,
    attribution: v.boolean,
    logo: v.boolean
  })(config);

  var encodedOverlay = (config.overlays || [])
    .map(function(overlayItem) {
      if (overlayItem.marker) {
        return encodeMarkerOverlay(overlayItem.marker);
      }
      if (overlayItem.path) {
        return encodePathOverlay(overlayItem.path);
      }
      return encodeGeoJsonOverlay(overlayItem.geoJson);
    })
    .join(',');

  var encodedPosition = encodePosition(config.position);
  var encodedDimensions = config.width + 'x' + config.height;
  if (config.highRes) {
    encodedDimensions += '@2x';
  }

  var preEncodedUrlParts = [encodedOverlay, encodedPosition, encodedDimensions]
    .filter(Boolean)
    .join('/');

  var query = {};
  if (config.attribution !== undefined) {
    query.attribution = String(config.attribution);
  }
  if (config.logo !== undefined) {
    query.logo = String(config.logo);
  }
  if (config.before_layer !== undefined) {
    query.before_layer = config.before_layer;
  }
  if (config.addlayer !== undefined) {
    query.addlayer = JSON.stringify(config.addlayer); // stringify to retain object shape
  }
  if (config.setfilter !== undefined) {
    query.setfilter = JSON.stringify(config.setfilter); // stringify to retain array shape
  }
  if (config.layer_id !== undefined) {
    query.layer_id = config.layer_id;
  }
  if (config.padding !== undefined) {
    query.padding = config.padding;
  }

  if (config.setfilter !== undefined && config.layer_id === undefined) {
    throw new Error('Must include layer_id in setfilter request');
  }

  if (
    (config.setfilter !== undefined || config.addlayer !== undefined) &&
    config.position === 'auto' &&
    config.overlays === undefined
  ) {
    throw new Error(
      'Auto extent cannot be used with style parameters and no overlay'
    );
  }

  if (config.addlayer !== undefined && config.setfilter !== undefined) {
    throw new Error(
      'addlayer and setfilter cannot be used in the same request'
    );
  }

  if (
    config.padding !== undefined &&
    config.position !== 'auto' &&
    config.position.bbox === undefined
  ) {
    throw new Error(
      'Padding can only be used with auto or bbox as the position.'
    );
  }

  if (config.position.bbox !== undefined && config.position.bbox.length !== 4) {
    throw new Error('bbox must be four coordinates');
  }

  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/:styleId/static/' + preEncodedUrlParts,
    params: pick(config, ['ownerId', 'styleId']),
    query: query,
    encoding: 'binary'
  });
};

function encodePosition(position) {
  if (position === 'auto') return 'auto';
  if (position.bbox) return JSON.stringify(position.bbox);

  return position.coordinates
    .concat([
      position.zoom,
      position.pitch && !position.bearing ? 0 : position.bearing, // if pitch is set, but bearing is not, bearing must be 0
      position.pitch === 0 ? undefined : position.pitch
    ])
    .filter(function(el) {
      return el === 0 || el; // filter out undefined and allow 0 values
    })
    .join(',');
}

function encodeMarkerOverlay(o) {
  if (o.url) {
    return encodeCustomMarkerOverlay(o);
  }
  return encodeSimpleMarkerOverlay(o);
}

/**
 * A simple marker overlay.
 * @typedef {Object} SimpleMarkerOverlay
 * @property {Object} marker
 * @property {[number, number]} marker.coordinates - `[longitude, latitude]`
 * @property {'large'|'small'} [marker.size='small']
 * @property {string} [marker.label] - Marker symbol. Options are an alphanumeric label `a`
 *   through `z`, `0` through `99`, or a valid [Maki](https://www.mapbox.com/maki/)
 *   icon. If a letter is requested, it will be rendered in uppercase only.
 * @property {string} [marker.color] - A 3- or 6-digit hexadecimal color code.
 */

function encodeSimpleMarkerOverlay(o) {
  v.assertShape({
    coordinates: v.required(v.coordinates),
    size: v.oneOf('large', 'small'),
    label: v.string,
    color: v.string
  })(o);

  var result = o.size === 'large' ? 'pin-l' : 'pin-s';
  if (o.label) {
    result += '-' + String(o.label).toLowerCase();
  }
  if (o.color) {
    result += '+' + sanitizeHexColor(o.color);
  }
  result += '(' + o.coordinates.join(',') + ')';
  return result;
}

/**
 * A marker overlay with a custom image.
 * @typedef {Object} CustomMarkerOverlay
 * @property {Object} marker
 * @property {[number, number]} marker.coordinates - `[longitude, latitude]`
 * @property {string} marker.url
 */

function encodeCustomMarkerOverlay(o) {
  v.assertShape({
    coordinates: v.required(v.coordinates),
    url: v.required(v.string)
  })(o);

  var result = 'url-' + encodeURIComponent(o.url);
  result += '(' + o.coordinates.join(',') + ')';
  return result;
}

/**
 * A stylable line.
 * @typedef {Object} PathOverlay
 * @property {Object} path
 * @property {Array<Coordinates>} path.coordinates - An array of coordinates
 *   describing the path.
 * @property {number} [path.strokeWidth]
 * @property {string} [path.strokeColor]
 * @property {number} [path.strokeOpacity] - Must be paired with strokeColor.
 * @property {string} [path.fillColor] - Must be paired with strokeColor.
 * @property {number} [path.fillOpacity] - Must be paired with fillColor.
 */

function encodePathOverlay(o) {
  v.assertShape({
    coordinates: v.required(v.arrayOf(v.coordinates)),
    strokeWidth: v.number,
    strokeColor: v.string,
    strokeOpacity: v.number,
    fillColor: v.string,
    fillOpacity: v.number
  })(o);

  if (o.strokeOpacity !== undefined && o.strokeColor === undefined) {
    throw new Error('strokeOpacity requires strokeColor');
  }
  if (o.fillColor !== undefined && o.strokeColor === undefined) {
    throw new Error('fillColor requires strokeColor');
  }
  if (o.fillOpacity !== undefined && o.fillColor === undefined) {
    throw new Error('fillOpacity requires fillColor');
  }

  var result = 'path';
  if (o.strokeWidth) {
    result += '-' + o.strokeWidth;
  }
  if (o.strokeColor) {
    result += '+' + sanitizeHexColor(o.strokeColor);
  }
  if (o.strokeOpacity) {
    result += '-' + o.strokeOpacity;
  }
  if (o.fillColor) {
    result += '+' + sanitizeHexColor(o.fillColor);
  }
  if (o.fillOpacity) {
    result += '-' + o.fillOpacity;
  }
  // polyline expects each coordinate to be in reversed order: [lat, lng]
  var reversedCoordinates = o.coordinates.map(function(c) {
    return [c[1], c[0]];
  });
  var encodedPolyline = polyline.encode(reversedCoordinates);
  result += '(' + encodeURIComponent(encodedPolyline) + ')';
  return result;
}

/**
 * GeoJSON to overlay the map.
 * @typedef {Object} GeoJsonOverlay
 * @property {Object} geoJson - Valid GeoJSON.
 */

function encodeGeoJsonOverlay(o) {
  v.assert(v.required(v.plainObject))(o);

  return 'geojson(' + encodeURIComponent(JSON.stringify(o)) + ')';
}

function sanitizeHexColor(color) {
  return color.replace(/^#/, '');
}

module.exports = createServiceFactory(Static);
