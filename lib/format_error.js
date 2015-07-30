'use strict';

function stripToken(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/access_token=[^& ]+/, 'access_token=...');
}

/**
 * Sanitize superagent error objects
 *
 * @private
 * @param {object} err an error object received from a superagent HTTP request
 * @returns {object} a sanitized representation of the HTTP error
 */
module.exports = function(err) {
  if (!err) return null;
  if (!err.response || !err.response.error) return err;
  var error = err.response.error;
  if (typeof error !== 'object') return err;
  error.message = stripToken(error.message || 'Unknown Error');
  Object.keys(error).forEach(function(key) {
    error[key] = stripToken(error[key]);
  });
  return error;
};
