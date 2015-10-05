'use strict';

var atob = require('atob');

/**
 * Access tokens actually are data, and using them we can derive
 * a user's username. This method attempts to do just that,
 * decoding the part of the token after the first `.` into
 * a username.
 *
 * @private
 * @param {string} token an access token
 * @return {string} username
 */
function getUser(token) {
  var data = token.split('.')[1];
  if (!data) return null;
  data = data.replace(/-/g, '+').replace(/_/g, '/');

  // window.atob does not require padding
  if (!process.browser) {
    var mod = data.length % 4;
    if (mod === 2) data += '==';
    if (mod === 3) data += '=';
    if (mod === 1 || mod > 3) return null;
  } else {
    data = data.replace(/=/g, '');
  }

  try {
    return JSON.parse(atob(data)).u;
  } catch(err) {
    return null;
  }
}

module.exports = getUser;
