'use strict';

var tokenCache = {};

/**
 * Parse a Mapbox access token.
 *
 * The result looks like this:
 *
 * ```js
 * {
 *   headers: string,
 *   payload: {
 *     ownerId: string,
 *     expires: number,
 *     created: number
 *   }
 * }
 * ```
 *
 * @param {string} token
 * @returns {Object}
 */
function parseToken(token) {
  var errorOut = function() {
    throw new Error('Invalid access token');
  };

  if (tokenCache[token]) {
    return tokenCache[token];
  }

  var split = token.split('.');
  var header = split[0];
  var rawPayload = split[1];
  if (!rawPayload) {
    errorOut();
  }

  try {
    var parsedPayload = void 0;
    if (global.atob) {
      parsedPayload = JSON.parse(global.atob(rawPayload));
    } else {
      parsedPayload = JSON.parse(
        new global.Buffer(rawPayload, 'base64').toString()
      );
    }
    var _payload = {
      ownerId: parsedPayload.u,
      expires: parsedPayload.exp,
      created: parsedPayload.iat
    };
    var result = {
      header: header,
      payload: _payload
    };
    tokenCache[token] = result;
    return result;
  } catch (e) {
    return errorOut();
  }
}

module.exports = parseToken;
