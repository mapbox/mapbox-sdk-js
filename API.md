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

Search for a location with a string, using the
[Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).

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
there. This uses the [Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).

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

## `getDirections`

Find directions from A to B, or between any number of locations.
Consult the [Mapbox Directions API](https://www.mapbox.com/developers/api/directions/)
for more documentation.

### Parameters

* `waypoints` **`Array<Object>`** an array of objects with `latitude` and `longitude` properties that represent waypoints in order. Up to 25 waypoints can be specified.
* `options` **`[Object]`** additional options meant to tune the request (optional, default `{}`)
* `callback` **`Function`** called with (err, results)


### Examples

```js
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.directions(
  [
    { latitude: 33.6, longitude: -95.4431 },
    { latitude: 33.2, longitude: -95.4431 } ],
  function(err, res) {
  // res is a document with directions
});

// With options
mapboxClient.getDirections([
  { latitude: 33.6875431, longitude: -95.4431142 },
  { latitude: 33.6875431, longitude: -95.4831142 }
], {
  profile: 'mapbox.walking',
  instructions: 'html',
  alternatives: false,
  geometry: 'polyline'
}, function(err, results) {
  console.log(results.origin);
});
```

Returns  nothing, calls callback

## `matching`

Snap recorded location traces to roads and paths from OpenStreetMap.
Consult the [Map Matching API](https://www.mapbox.com/developers/api/map-matching/)
for more documentation.

### Parameters

* `trace` **`Object`** a single [GeoJSON](http://geojson.org/) Feature with a LineString geometry, containing up to 100 positions.
* `options` **`[Object]`** additional options meant to tune the request (optional, default `{}`)
* `callback` **`Function`** called with (err, results)


### Examples

```js
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.matching({
  "type": "Feature",
  "properties": {
    "coordTimes": [
      "2015-04-21T06:00:00Z",
      "2015-04-21T06:00:05Z",
      "2015-04-21T06:00:10Z",
      "2015-04-21T06:00:15Z",
      "2015-04-21T06:00:20Z"
    ]
    },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [ 13.418946862220764, 52.50055852688439 ],
      [ 13.419011235237122, 52.50113000479732 ],
      [ 13.419756889343262, 52.50171780290061 ],
      [ 13.419885635375975, 52.50237416816131 ],
      [ 13.420631289482117, 52.50294888790448 ]
    ]
  }
},
  function(err, res) {
  // res is a document with directions
});
```

Returns  nothing, calls callback

