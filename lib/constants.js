var compile = require('es6-template-strings/compile');

module.exports.DEFAULT_ENDPOINT = 'https://api.mapbox.com';
module.exports.API_GEOCODER_FORWARD = compile('${endpoint}/v4/geocode/${dataset}/${encodeURIComponent(query)}.json?${query}');
module.exports.API_GEOCODER_REVERSE = compile('${endpoint}/v4/geocode/${dataset}/${location.longitude},${location.latitude}.json?${query}');
module.exports.API_DIRECTIONS = compile('${endpoint}/v4/directions/${profile}/${encodedWaypoints}.json?${query}');
module.exports.API_SURFACE = compile('${endpoint}/v4/surface/${mapid}.json?${query}');
module.exports.API_MATCHING = compile('${endpoint}/matching/v4/${profile}.json?${query}');
