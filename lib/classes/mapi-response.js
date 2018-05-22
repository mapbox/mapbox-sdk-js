'use strict';

var parseLinkHeader = require('../helpers/parse-link-header');

/**
 * A Mapbox API response.
 *
 * @class MapiResponse
 * @property {Object} body - The response body, parsed as JSON.
 * @property {string} rawBody - The raw response body.
 * @property {number} statusCode - The response's status code.
 * @property {Object} headers - The parsed response headers.
 * @property {Object} links - The parsed response links.
 * @property {MapiRequest} request - The response's originating `MapiRequest`.
 */

/**
 * @ignore
 * @param {MapiRequest} request
 * @param {Object} responseData
 * @param {Object} responseData.headers
 * @param {string} responseData.body
 * @param {number} responseData.statusCode
 */
function MapiResponse(request, responseData) {
  this.request = request;
  this.headers = responseData.headers;
  this.rawBody = responseData.body;
  this.statusCode = responseData.statusCode;
  try {
    this.body = JSON.parse(responseData.body || '{}');
  } catch (parseError) {
    this.body = responseData.body;
  }
  this.links = parseLinkHeader(this.headers.link);
}

/**
 * Check if there is a next page that you can fetch.
 *
 * @returns {boolean}
 */
MapiResponse.prototype.hasNextPage = function hasNextPage() {
  return !!this.links.next;
};

/**
 * Create a request for the next page, if there is one.
 * If there is no next page, returns `null`.
 *
 * @returns {MapiRequest | null}
 */
MapiResponse.prototype.nextPage = function nextPage() {
  if (!this.hasNextPage()) return null;
  return this.request._extend({
    path: this.links.next.url
  });
};

module.exports = MapiResponse;
