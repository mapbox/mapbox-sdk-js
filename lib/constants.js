var compile = require('es6-template-strings/compile');

var API = 'https://api.tiles.mapbox.com/';
var APIV4 = API + 'v4/';

module.exports.API = API;
module.exports.API_GEOCODER_FORWARD = compile(APIV4 + 'geocode/${dataset}/${encodeURIComponent(query)}.json');
module.exports.API_GEOCODER_REVERSE = compile(APIV4 + 'geocode/${dataset}/${location.longitude},${location.latitude}.json');
module.exports.API_DIRECTIONS = compile(APIV4 + 'directions/${profile}/${encodedWaypoints}.json');
module.exports.API_MATCHING = compile(API + 'matching/v4/${profile}.json');
