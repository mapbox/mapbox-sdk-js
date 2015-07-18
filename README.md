# node-mapbox

[![npm version](https://badge.fury.io/js/mapbox.svg)](http://badge.fury.io/js/mapbox)
[![Build Status](https://travis-ci.org/mapbox/mapbox-sdk-js.svg?branch=master)](https://travis-ci.org/mapbox/mapbox-sdk-js)
[![Coverage Status](https://coveralls.io/repos/mapbox/mapbox-sdk-js/badge.svg?branch=master&service=github)](https://coveralls.io/github/mapbox/mapbox-sdk-js?branch=master)

A [node.js](https://nodejs.org/) and browser JavaScript client
to Mapbox services.

## Services

* [Geocoding](https://www.mapbox.com/developers/api/geocoding/)
  * Forward (place names ⇢  longitude, latitude)
  * Reverse (longitude, latitude ⇢ place names)
* [Directions](https://www.mapbox.com/developers/api/directions/)
  * Profiles for driving, walking, and cycling
  * GeoJSON & Polyline formatting
  * Instructions as text or HTML
* [Map Matching](https://www.mapbox.com/developers/api/map-matching/)
  * Aligns GPS trace data to roads and paths from
    [OpenStreetMap](https://www.openstreetmap.org/) data
* [Surface API](https://www.mapbox.com/developers/api/surface/)
  * Interpolates values along lines. Useful for elevation traces.

## Installation

```sh
$ npm install --save mapbox
```

## [API](API.md)
