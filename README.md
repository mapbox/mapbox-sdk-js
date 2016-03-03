# mapbox-sdk-js

[![npm version](https://badge.fury.io/js/mapbox.svg)](http://badge.fury.io/js/mapbox)
[![Build Status](https://travis-ci.org/mapbox/mapbox-sdk-js.svg?branch=master)](https://travis-ci.org/mapbox/mapbox-sdk-js)
[![Coverage Status](https://coveralls.io/repos/mapbox/mapbox-sdk-js/badge.svg?branch=master&service=github)](https://coveralls.io/github/mapbox/mapbox-sdk-js?branch=master)

A [node.js](https://nodejs.org/) and browser JavaScript client
to Mapbox services.

## Services

Generally Available

* [Geocoding](https://www.mapbox.com/developers/api/geocoding/)
  * Forward (place names ⇢  longitude, latitude)
  * Reverse (longitude, latitude ⇢ place names)
* [Upload API](https://www.mapbox.com/developers/api/uploads/)
  * Upload data to be processed and hosted by Mapbox.
* [Directions](https://www.mapbox.com/developers/api/directions/)
  * Profiles for driving, walking, and cycling
  * GeoJSON & Polyline formatting
  * Instructions as text or HTML

Contact help@mapbox.com for information

* [Distance](https://www.mapbox.com/developers/api/distance/)
  * Travel-time tables between up to 100 points
  * Profiles for driving, walking and cycling
* [Map Matching](https://www.mapbox.com/developers/api/map-matching/)
  * Aligns GPS trace data to roads and paths from
    [OpenStreetMap](https://www.openstreetmap.org/) data
* [Surface API](https://www.mapbox.com/developers/api/surface/)
  * Interpolates values along lines. Useful for elevation traces.

Not currently public

* Datasets
  * Retrieve, add, and edit datasets.
  * **Note: The Mapbox Datasets API is in private beta. Currently, all end user requests to this API from outside of Mapbox will 404.**

## Installation

```sh
$ npm install --save mapbox
```

## Usage

Basic usage of the geocoder:

```js
var MapboxClient = require('mapbox');
var client = new MapboxClient('YOUR_ACCESS_TOKEN');
client.geocodeForward('Chester, NJ', function(err, res) {
  // res is the geocoding result as parsed JSON
});
```

### sub-requiring individual services

Each service is available as a sub-require if you'd only like to include only
its functionality and not the entire bundle. The returned `MapboxClient`
will have the same constructor style but only include functions necessary
for that service's support.

Available sub-requires:

* geocoding: `require('mapbox/lib/services/geocoding')`
* surface: `require('mapbox/lib/services/surface')`
* matching: `require('mapbox/lib/services/matching')`
* directions: `require('mapbox/lib/services/directions')`

## [API](API.md)
