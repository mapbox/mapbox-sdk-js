var request = require('request');

module.exports = (function() {
    var api_key = null;

    var mapbox = {};

    mapbox.apiKey = function(_) {
        if (!arguments.length) return api_key;
        api_key = _;
        return mapbox;
    };

    mapbox.geocode = function(_, cb) {
        if (!api_key) return cb(new Error('API Key Required'));
        request({
            url: 'http://api.tiles.mapbox.com/v3/' + api_key + '/geocode/' + encodeURIComponent(_) + '.json',
            json: true
        }, cb);
    };

    return mapbox;
})();
