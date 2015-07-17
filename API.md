## `MapboxClient`

The JavaScript API to Mapbox services

### Parameters

* `accessToken` **`string`** a private or public access token


### Examples

```js
var client = new MapboxClient('ACCESSTOKEN');
```


| type | description |
| ---- | ----------- |
| `Error` | if accessToken is not provided |
## `geocodeForward`

Search for a location with a string.

### Parameters

* `query` **`string`** desired location
* `options` **`[Object]`** additional options meant to tune the request (optional, default `{}`)
* `callback` **`Function`** called with (err, results)


### Examples

```js
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.geocodeForward('Paris, France', function(err, res) {
  // res is a GeoJSON document with geocoding matches
});
// using the proximity option to weight results closer to texas
mapboxClient.geocodeForward('Paris, France', {
  proximity: { latitude: 33.6875431, longitude: -95.4431142 }
}, function(err, res) {
  // res is a GeoJSON document with geocoding matches
});
```

Returns  nothing, calls callback

## `geocodeReverse`

Given a location, determine what geographical features are located
there.

### Parameters

* `location` **`Object`** the geographical point to search
* `options` **`[Object]`** additional options meant to tune the request (optional, default `{}`)
* `callback` **`Function`** called with (err, results)


### Examples

```js
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.geocodeReverse(
  { latitude: 33.6875431, longitude: -95.4431142 },
  function(err, res) {
  // res is a GeoJSON document with geocoding matches
});
```

Returns  nothing, calls callback

