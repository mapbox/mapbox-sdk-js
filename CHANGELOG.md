## 1.0.0-beta1

* Add `bbox` option to geocoder API

## 1.0.0-beta

- Changes a major API! Geocoding is now named geocoding everywhere, so the
  sub-require is `mapbox/lib/services/geocoding`, not, like it used to be,
  `mapbox/lib/services/geocoder`
- The `DatasetClient#bulkFeatureUpdate` method is renamed
  `DatasetClient#batcFeatureUpdate` to match the rest of the Mapbox ecosystem.

## 0.12.0

- Add types & country options to geocoder [#65](https://github.com/mapbox/mapbox-sdk-js/pull/65)

## 0.11.0

- Allow pagination options if passed in listFeatures [#61](https://github.com/mapbox/mapbox-sdk-js/pull/61)

## 0.10.0

- Support query params for Directions requests [#58](https://github.com/mapbox/mapbox-sdk-js/pull/58)

## 0.9.0

- Adds a `precision` option to geocodeForward and geocodeReverse methods:
  this allows you to customize how much decimal precision is provided
  wth proximity parameters and the location of geocodeReverse requests,
  potentially increasing cache-friendliness.

## 0.8.2

- Fixes geocodeReverse method

## 0.8.1

- Include Mapbox Distance in default client

## 0.8.0

- Added support for the [Distance API](https://www.mapbox.com/blog/distance-api/)

## 0.7.0

- Improved error handling
- Added support for Tileset statistics API (in preview)

## 0.6.2

- Added support for [Upload API](https://www.mapbox.com/developers/api/uploads/)
- Added support for Datasets API (in preview)

## 0.6.1

* Fixed bug in forward geococoding

## 0.6.0

* Allows endpoint to be customized
* Support for sub-requiring individual services

## 0.5.0

* Added `surface` method that connects to [Mapbox Surface API](https://www.mapbox.com/developers/api/surface/)

## 0.4.0

* Added `matching` method that connects to the [Mapbox Map Matching API](https://www.mapbox.com/blog/map-matching)

## 0.3.0

* Added `getDirections` method that connects to the [Mapbox Directions API](https://www.mapbox.com/developers/api/directions/)

## 0.2.0

* Added `geocodeForward` and `geocodeReverse` that connect to the [Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/)
