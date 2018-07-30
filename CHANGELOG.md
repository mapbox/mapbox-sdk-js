# Changelog

## HEAD

- **Fix:** Fix bug in `Static#getStaticImage` that resulted in reversed coordinates when creating a polyline overlay.

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
