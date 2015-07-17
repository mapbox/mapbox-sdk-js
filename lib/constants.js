var compile = require('es6-template-strings/compile');

var API = 'http://api.tiles.mapbox.com/v4/';

module.exports.API = API;
module.exports.API_GEOCODER_FORWARD = compile(API + 'geocode/${dataset}/${encodeURIComponent(query)}.json');
module.exports.API_GEOCODER_REVERSE = compile(API + 'geocode/${dataset}/${location.longitude},${location.latitude}.json');
module.exports.API_DIRECTIONS = compile(API + 'directions/${profile}/${encodedWaypoints}.json');
