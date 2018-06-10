'use strict';

var constants = require('../constants');

/**
 * A Mapbox API error.
 *
 * If there's an error during the API transaction,
 * the Promise returned by `MapiRequest`'s [`send`](#send)
 * method should reject with a `MapiError`.
 *
 * @class MapiError
 * @hideconstructor
 * @property {MapiRequest} request - The errored request.
 * @property {string} type - The type of error. Usually this is `'HttpError'`.
 *   If the request was aborted, so the error was
 *   not sent from the server, the type will be
 *   `'RequestAbortedError'`.
 * @property {number} [statusCode] - The numeric status code of
 *   the HTTP response.
 * @property {Object | string} [body] - If the server sent a response body,
 *   this property exposes that response, parsed as JSON if possible.
 * @property {string} [message] - Whatever message could be derived from the
 *   call site and HTTP response.
 *
 * @param {MapiRequest} options.request
 * @param {number} [options.statusCode]
 * @param {string} [options.body]
 * @param {string} [options.message]
 * @param {string} [options.type]
 */
function MapiError(options) {
  var errorType = options.type || constants.ERROR_HTTP;

  var body;
  if (options.body) {
    try {
      body = JSON.parse(options.body);
    } catch (e) {
      body = options.body;
    }
  } else {
    body = null;
  }

  var message = options.message || null;
  if (!message) {
    if (typeof body === 'string') {
      message = body;
    } else if (body && typeof body.message === 'string') {
      message = body.message;
    } else if (errorType === constants.ERROR_REQUEST_ABORTED) {
      message = 'Request aborted';
    }
  }

  this.message = message;
  this.type = errorType;
  this.statusCode = options.statusCode || null;
  this.request = options.request;
  this.body = body;
}

module.exports = MapiError;
