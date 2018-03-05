## 1.0.0-beta10

- **Bug** Fix bug preventing Geocoding service being used without an `options` parameter when using promise syntax. [#197](https://github.com/mapbox/mapbox-sdk-js/pull/197)
- **Feature** Geocoding `language`, `country` and `types` parameters can be passed as arrays as an alternative to comma separated strings. [#208](https://github.com/mapbox/mapbox-sdk-js/pull/208)

## 1.0.0-beta9

- **Feature** Add language parameter to geocoding API. [#174](https://github.com/mapbox/mapbox-sdk-js/issues/174)

## 1.0.0-beta8

- **Deprecation** Distance API has been deprecated and is now referred to the Matrix API. This renames .getDistances() method to .getMatrix(). [#177](https://github.com/mapbox/mapbox-sdk-js/pull/177)


## 1.0.0-beta7

- **Deprecation** Renamed .getStaticURL() method to .getStaticClassicURL() [#152](https://github.com/mapbox/mapbox-sdk-js/pull/152)
- **Feature** Add Styles Static API [#152](https://github.com/mapbox/mapbox-sdk-js/pull/152)
- **Feature** Add Tilesets API [#165](https://github.com/mapbox/mapbox-sdk-js/pull/165)
- **Feature** Add Tokens API [#155](https://github.com/mapbox/mapbox-sdk-js/pull/155)
- **Feature** Add response.nextPage() method for pagination of list resources [#159](https://github.com/mapbox/mapbox-sdk-js/pull/159)
- **Bug** Avoid double URL encoding of geojson static overlays [#156](https://github.com/mapbox/mapbox-sdk-js/pull/156)
- **Update** Remove start and reverse opts for datasets listings
- **Update** Clarify account/profile property for Directions API [#150](https://github.com/mapbox/mapbox-sdk-js/pull/150)
- **Update** Miscellaneous documentation polish

Special thanks to @andrewharvey for significant contributions to this release

## 1.0.0-beta6

- **Bug** Add `autocomplete` param to geocoding endpoint. [#126](https://github.com/mapbox/mapbox-sdk-js/pull/126)
- **Bug** Install Promise polyfill only when needed. [#122](https://github.com/mapbox/mapbox-sdk-js/pull/122)
- **Update** Update Map Matching to `v5`. [#128](https://github.com/mapbox/mapbox-sdk-js/pull/128)
- **Update** Update Directions to `v5`. [#68](https://github.com/mapbox/mapbox-sdk-js/pull/68)

## 1.0.0-beta5

- Add `limit` option to geocoder API
- Add `poi.landmark` type to geocoder API
- Fixes a bug where the global `Promise` object was overwritten by a polyfill

## 1.0.0-beta4

- Adds the concept of a reponse object
- Update all callbacks to provide `err, body, response`.
- Change default returned value for promises from `body` to `response`.
- Remove `client.batchFeatureUpdate`. `client.insertFeature` or `client.destroyFeture` should be used now.

## 1.0.0-beta3

- Update tilestat service for new API.

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
