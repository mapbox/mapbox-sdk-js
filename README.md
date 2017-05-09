# mapbox-sdk-js

[![npm version](https://badge.fury.io/js/mapbox.svg)](http://badge.fury.io/js/mapbox)
[![Build Status](https://travis-ci.org/mapbox/mapbox-sdk-js.svg?branch=master)](https://travis-ci.org/mapbox/mapbox-sdk-js)
[![Coverage Status](https://coveralls.io/repos/mapbox/mapbox-sdk-js/badge.svg?branch=master&service=github)](https://coveralls.io/github/mapbox/mapbox-sdk-js?branch=master)

A [node.js](https://nodejs.org/) and browser JavaScript client
to Mapbox services.

## Services

Generally Available

* [Geocoding](https://www.mapbox.com/api-documentation/#geocoding)
  * Forward (place names ⇢  longitude, latitude)
  * Reverse (longitude, latitude ⇢ place names)
* [Upload API](https://www.mapbox.com/api-documentation/#uploads)
  * Upload data to be processed and hosted by Mapbox.
* [Directions](https://www.mapbox.com/api-documentation/#directions)
  * Profiles for driving, walking, and cycling
  * GeoJSON & Polyline formatting
  * Instructions as text or HTML
* [Datasets](https://www.mapbox.com/api-documentation/#datasets)
  * Retrieve, add, and edit datasets.
* [Styles](https://www.mapbox.com/api-documentation/#styles)
  * Retrieve, add and edit styles, fonts and icons.
* [Tilesets](https://www.mapbox.com/api-documentation/#tilesets)
  * List tilesets.
* [Tokens](https://www.mapbox.com/api-documentation/#tokens)
  * Retrieve, add and edit access tokens.

Contact help@mapbox.com for information

* [Distance](https://www.mapbox.com/developers/api/distance/)
  * Travel-time tables between up to 100 points
  * Profiles for driving, walking and cycling
* [Map Matching](https://www.mapbox.com/developers/api/map-matching/)
  * Aligns GPS trace data to roads and paths from
    [OpenStreetMap](https://www.openstreetmap.org/) data
* [Surface API](https://www.mapbox.com/developers/api/surface/)
  * Interpolates values along lines. Useful for elevation traces.

## Installation

```sh
$ npm install --save mapbox
```

## Usage

Setup:

```js
var MapboxClient = require('mapbox');
var client = new MapboxClient('YOUR_ACCESS_TOKEN');
```

Basic usage of the geocoder:

```js
client.geocodeForward('Chester, NJ', function(err, data, res) {
  // data is the geocoding result as parsed JSON
  // res is the http response, including: status, headers and entity properties
});
```

As an alternative to callbacks, each method also returns a Promise:

```js
client.geocodeForward('Chester, NJ')
  .then(function(res) {
    // res is the http response, including: status, headers and entity properties
    var data = res.entity; // data is the geocoding result as parsed JSON
  })
  .catch(function(err) {
    // handle errors
  });
```

### pagination

Listing resources may return a subset of the entire listing. If more pages are
available the `res` object will contain a `.nextPage()` method. This method
requires no arguments, other than an optional callback function, otherwise a
Promise is returned.

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
* distance: `require('mapbox/lib/services/distance')`
* datasets: `require('mapbox/lib/services/datasets')`
* styles: `require('mapbox/lib/services/styles')`
* uploads: `require('mapbox/lib/services/uploads')`
* tilestats: `require('mapbox/lib/services/tilestats')`
* static: `require('mapbox/lib/services/static')`
* tilesets: `require('mapbox/lib/services/tilesets')`
* tokens: `require('mapbox/lib/services/tokens')`

## [API](API.md)
