var request = require('request');

module.exports = function(api_key) {
    if (!api_key) return new Error('API Key Required');

    var mapbox = {},
        base = 'http://api.tiles.mapbox.com/v3/';

    mapbox.apiKey = function(_) {
        if (!arguments.length) return api_key;
        api_key = _;
        return mapbox;
    };

    mapbox.geocode = function(_, cb) {
        return request({
            url: base + api_key + '/geocode/' + encodeURIComponent(_) + '.json',
        });
    };

    mapbox.static = function(_, cb) {
        var markers = '';
        if (_.markers) {
            markers = _.markers.map(function(m) {
                return 'pin-m(' + [m.lon, m.lat].join(',') + ')';
            }).join(',') + '/';
        }
        return request({
            url: base + api_key + '/' +
                markers +
                [_.lon, _.lat, _.z].join(',') + '/' + [_.width || 640, _.height || 320].join('x') + '.png'
        });
    };

    return mapbox;
};
