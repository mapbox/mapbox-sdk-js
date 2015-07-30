var compile = require('es6-template-strings/compile');

module.exports.DEFAULT_ENDPOINT = 'https://api.mapbox.com';
module.exports.API_GEOCODER_FORWARD = compile('${endpoint}/v4/geocode/${dataset}/${encodeURIComponent(forwardQuery)}.json?${query}');
module.exports.API_GEOCODER_REVERSE = compile('${endpoint}/v4/geocode/${dataset}/${location.longitude},${location.latitude}.json?${query}');
module.exports.API_DIRECTIONS = compile('${endpoint}/v4/directions/${profile}/${encodedWaypoints}.json?${query}');
module.exports.API_SURFACE = compile('${endpoint}/v4/surface/${mapid}.json?${query}');
module.exports.API_UPLOADS = compile('${endpoint}/uploads/v1/${owner}?${query}');
module.exports.API_UPLOAD = compile('${endpoint}/uploads/v1/${owner}/${upload}?${query}');
module.exports.API_UPLOAD_CREDENTIALS = compile('${endpoint}/uploads/v1/${owner}/credentials?${query}');
module.exports.API_MATCHING = compile('${endpoint}/matching/v4/${profile}.json?${query}');
module.exports.API_DATASET_DATASETS = compile('${endpoint}/datasets/v1/${owner}?${query}');
module.exports.API_DATASET_DATASET = compile('${endpoint}/datasets/v1/${owner}/${dataset}?${query}');
module.exports.API_DATASET_FEATURES = compile('${endpoint}/datasets/v1/${owner}/${dataset}/features?${query}');
module.exports.API_DATASET_FEATURE = compile('${endpoint}/datasets/v1/${owner}/${dataset}/features/${id}?${query}');
