'use strict';

var polyline = require('@mapbox/polyline');
var v = require('./service-helpers/validator');
var createServiceFactory = require('./service-helpers/create-service-factory');
var pick = require('./service-helpers/pick');

/**
 * Static API service.
 *
 * Learn more about this service and its responses in
 * [the HTTP service documentation](https://www.mapbox.com/api-documentation/#static).
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
 * @param {'auto'|Object} config.position - If `"auto"`, the viewport will fit the
 *   bounds of the overlay(s). Otherwise, the maps' position is described by an object
 *   with the following properties:
 *   `coordinates` (required): `[longitude, latitude]` for the center of image.
 *   `zoom` (required): Between 0 and 20.
 *   `bearing` (optional): Between 0 and 360.
 *   `pitch` (optional): Between 0 and 60.
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
 * @param {string} [config.insertOverlayBeforeLayer] - The ID of the style layer
 *   that overlays should be inserted *before*.
 * @param {boolean} [config.attribution=true] - Whether there is attribution
 *   on the map image.
 * @param {boolean} [config.logo=true] - Whether there is a Mapbox logo
 *   on the map image.
 * @return {MapiRequest}
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
        })
      )
    ),
    overlays: v.arrayOf(v.plainObject),
    highRes: v.boolean,
    insertOverlayBeforeLayer: v.string,
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
  if (config.insertOverlayBeforeLayer !== undefined) {
    query.before_layer = config.insertOverlayBeforeLayer;
  }

  return this.client.createRequest({
    method: 'GET',
    path: '/styles/v1/:ownerId/:styleId/static/' + preEncodedUrlParts,
    params: pick(config, ['ownerId', 'styleId']),
    query: query
  });
};

function encodePosition(position) {
  if (position === 'auto') return 'auto';

  return position.coordinates
    .concat([position.zoom, position.bearing, position.pitch])
    .filter(Boolean)
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
    return c.reverse();
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
