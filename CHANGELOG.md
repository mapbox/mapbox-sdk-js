# Changelog

## 0.16.1

- **Add:** Add `session_token` as optional parameter in the geocoding services

## 0.16.0

- **Add:** Add `depart_at` as optional parameter in the isochrone service

## 0.15.6

- **Fix:** Add `secondary_address` to list of accepted types for Geocoding v6

## 0.15.5

- **Fix:** Rename directions api annotation option `max_speed` to `maxspeed` [#480](https://github.com/mapbox/mapbox-sdk-js/pull/480)

## 0.15.4

- **Fix:** Set `body = ''` for POST, PUT, PATCH, and DELETE requests that do not have a body [#479](https://github.com/mapbox/mapbox-sdk-js/pull/479)

## 0.15.3

- **Fix:** Maximum Optimization V1 request size limits should not be enforced client-side

## 0.15.2

- **Add:** Add `depart_at` and `arrive_by` as optional parameters in the directions service

## 0.15.1

- **Add:** Add `driving-traffic` as a profile option in the isochrone service

## 0.15.0

- **Add:** Geocoding `v6` service

## 0.14.0

- **Add:** Config for `Tokens#createToken` and `Tokens#updateToken` can now include the `allowedApplications` property.


## 0.13.7

- **Add:** add additional EV values to the directions API request

## 0.13.6

- **Add:** add additional valid values for the directions api `annotations` option
- **Chore:** update `documentation`, `budo`, `meow`, and `remark-preset-davidtheclark` dependencies
- **Chore:** update `jest` and associated dependencies

## 0.13.5

- **Revert:** add `driving-traffic` profile to Isochrone service.
- **Fix:** Pin CI node version to LTS release (current LTS is 16.x).
- **Fix:** Fix-up package-lock.json with new metadata (based on node 14).
- **Fix:** Update `got` dependency to 11.8.5 (Fix for CVE-2022-33987).
- **Add:** add electric vehicle routing parameters to Directions service.

## 0.13.4

**Add:** add `contours_meters` Isochrone API parameter

## 0.13.3

**Add:** add `ip` as valid value for `proximity` parameter in the geocoding service

## 0.13.2

**Add:** add `fuzzyMatch` and `worldview` parameters to the geocoding service

## 0.13.1

**Fix:** Update `got` depdendency to 10.7.0

## 0.13.0

**Add:** add `driving-traffic` profile to Isochrone service.

## 0.12.1

- **PATCH:** [remove unsupported `private` option](https://github.com/mapbox/mapbox-sdk-js/pull/405) from `createUpload`.

## 0.12.0

- **Add:** add `bounding box` parameter as a position option for `Static#getStaticImage.`
- **Add:** add `padding` optional parameter for `Static#getStaticImage`.

## 0.11.0

- **Add:** add `fresh` parameter to `Styles#getStyle` to bypass the cached version of the style.
- **Add:** add `routing` parameter to `Geocoding#forwardGeocode` and `Geocoding#reverseGeocoding`.
- **Add:** add `driving-traffic` profile to `Optimization#getOptimization`.
- **Add:** add `sortby` parameter to `Datasets#listDatasets`.
- **Add:** add `Tilesets#updateTileset`.
- **Add:** add `fallback`, `mapboxGLVersion` and `mapboxGLGeocoderVersion` to `Styles#getEmbeddableHtml`.
- **Add:** add pagination support to `Tilesets#listTilesetJobs` and `Tilesets#listTilesetSources`.
- **Breaking change:** `Uploads#createUpload`'s `mapId` parameter is now `tileset`, and `tilesetName` is now `name` to be consistent across the API. `mapId` and `tilesetName` are deprecated, but will still work and may be removed in a future release.
- **Add:** add `private` option to `Uploads#createUpload`.
- **Fix:** fixed an issue where array parameters containing falsy values (e.g. for the `proximity` parameter in `forwardGeocode`, where longitude or latitude coordinates are 0) were not being applied correctly.

## 0.10.0

- **Add:** add new parameters to `Tilesets#listTilesets`: `type`, `limit`, `sortBy`, `start` and `visibility`.
- **Add:** add `Tilesets#tileJSONMetadata` method to retrieve a Tileset TileJSON metadata.
- **Add:** add new `metadata` parameter to `Styles#getStyle` to preserve `mapbox:` specific metadata from the style.
- **Add:** add new Tilesets methods `deleteTileset`, `createTilesetSource`, `getTilesetSource`, `listTilesetSources`, `deleteTilesetSource`, `createTileset`, `publishTileset`, `tilesetStatus`, `tilesetJob`, `listTilesetJobs`, `getTilesetsQueue`, `validateRecipe`, `getRecipe`, `updateRecipe`.
- **Add:** add new `draft` parameter to `Styles#getStyle`, `Styles#deleteStyleIcon` and `Styles#getStyleSprite`, `Styles#getEmbeddableHtml` to work with draft styles.
- **Fix:** Fix responses containing binary data when using `Static#getStaticImage`, `Styles#getStyleSprite` and `Styles#getFontGlyphRange`.
- **Fix:** Fix requests for highres sprites in `Styles#getStyleSprite`.
- **Fix:** set `position.bearing` to `0` if `position.pitch` is defined and `position.bearing` is not in the Static API.
- **Fix:** use `tilesets.getRecipe` in tilesets API example.

## 0.9.0

- **Add:** add Isochrone API service.

## 0.8.0

- **Add**: add new style parameters to the Static Images API service: `addlayer`, `setfilter`, and `layer_id`.
- **Breaking change**: `insertOverlayBeforeLayer` is now `before_layer` in the Static Images API service. This change uses the API's name for the field and to support that the field can be used with the new style parameter `addlayer`.

## 0.7.1

- **Fix:** add missing `geometry` key to Tilequery service.

## 0.7.0

- **Fix:** filter empty waypoints from map matching requests.
- **Fix:** fix url token placement for service with clients.

## 0.6.0

- **Fix:** `Tokens#updateToken` can now set `null` value to `referrers` property to delete the property.
- **Fix:** `Tokens#updateToken` can now set `null` value to `resources` property to delete the property.
- **Breaking change**: change all references to `referrer`{s} to `allowedUrl`{s}.

## 0.5.0

- **Add:** Config for `Tokens#createToken` and `Tokens#updateToken` can now include the `referrers` property.

## 0.4.1

- **Fix:** Fix a CORS-related bug that caused Firefox to send preflight `OPTIONS` requests that were rejected by the server. This bug surfaced in Firefox with the Tilequery API, but may possibly have affected some other endpoints and some other browsers.

## 0.4.0

- **Breaking change & fix:** Config for `Static#getStaticImage` now includes a `position` property that can be either `"auto"` or an object with `coordinates`, `zoom`, etc., properties. This fixes buggy behavior with the `"auto"` keyboard by forcing it to be mutually exclusive with all other positioning options.
- **Fix:** Fix bug in `Static#getStaticImage` that resulted in reversed coordinates when creating a polyline overlay.
- **Fix:** Loosen the type validation on coordinates, since longitudes greater than 180 or less than -180 are valid for some APIs.

## 0.3.0

- **Change:** Rename `MapMatching#getMatching` to `MapMatching#getMatch`.
- **Change:** Throw validation error if request configuration object includes invalid properties. This is a breaking change because it could cause your code to throw a new validation error informing you of a mistake in your code. But there is no change to the library's functionality: you'll just need to clean up invalid properties.

## 0.2.0

- **Add:** Add Optimization API service.

## 0.1.3

- **Fix:** Include all services in the UMD bundled client. Several were missing.

## 0.1.2

- **Chore:** Use `@mapbox/fusspot` for validation; remove the local implementation.

## 0.1.1

- **Fix:** `Directions#getDirections` and `Geocoding#forwardGeocode` stringify boolean query parameters like `steps` and `autocomplete`.

## 0.1.0

- Brand new codebase. Please read the documentation and try it out! The `mapbox` npm package is now deprecated in favor of the new `@mapbox/mapbox-sdk`.
