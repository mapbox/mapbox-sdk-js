'use strict';

function getUser(token) {
  var data = token.split('.')[1];
  if (!data) return null;
  data = data.replace(/-/g, '+').replace(/_/g, '/');

  var mod = data.length % 4;
  if (mod === 2) data += '==';
  if (mod === 3) data += '=';
  if (mod === 1 || mod > 3) return null;

  try {
    data = (new Buffer(data, 'base64')).toString('utf8');
    return JSON.parse(data).u;
  } catch(err) {
    return null;
  }
}

module.exports = getUser;
