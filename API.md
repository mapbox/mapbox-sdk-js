# bulkFeatureUpdate

Perform a batch of inserts, updates, and deletes to a dataset in a single combined request.
This request requires an access token with the datasets:write scope.
There are a number of limits to consider when making this request:

-   you can send a total of 100 changes (sum of puts + deletes) in a single request
-   any single feature cannot be larger than 500 KB
-   the dataset must not exceed 2000 total features
-   the dataset must not exceed a total of 5 MB

**Parameters**

-   `update` **object** an object describing features in insert and/or delete
    -   `update.put` **[Array&lt;object&gt;]** features to insert. Each feature must be a valid GeoJSON feature per <http://geojson.org/geojson-spec.html#feature-objects>
    -   `update.delete` **[Array&lt;string&gt;]** ids of features to delete
-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var inserts = [
  {
    "id": "1",
    "type": "Feature",
    "properties": {
      "name": "Null Island"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [0, 0]
    }
  },
  {
    "id": "2",
    "type": "Feature",
    "properties": {
      "name": "Offshore from Null Island"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [0.01, 0.01]
    }
  }
];
var deletes =[
  'feature-id-1',
  'feature-id-2'
];
client.bulkFeatureUpdate({ put: inserts, delete: deletes }, dataset, function(err, results) {
 console.log(results);
// {
//   "put": [
//     {
//       "id": {feature-id},
//       "type": "Feature",
//       "properties": {
//         "name": "Null Island"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [0, 0]
//       }
//     },
//     {
//       "id": {feature-id},
//       "type": "Feature",
//       "properties": {
//         "name": "Offshore from Null Island"
//       },
//       "geometry": {
//         "type": "Point",
//         "coordinates": [0.01, 0.01]
//       }
//     }
//   ],
//   "delete": [
//     "feature-id-1",
//     "feature-id-2"
//   ]
// }
});
```

Returns **undefined** nothing, calls callback

# createDataset

To create a new dataset. Valid properties include title and description (not required).
This request requires an access token with the datasets:write scope.

**Parameters**

-   `options` **[object]** an object defining a dataset's properties
    -   `options.name` **[string]** the dataset's name
    -   `options.description` **[string]** the dataset's description
-   `callback` **Function** called with (err, dataset)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.createDataset({ name: 'foo', description: 'bar' }, function(err, dataset) {
  console.log(dataset);
  // {
  //   "owner": {account},
  //   "id": {dataset id},
  //   "name": "foo",
  //   "description": "description",
  //   "created": {timestamp},
  //   "modified": {timestamp}
  // }
});
```

Returns **undefined** nothing, calls callback

# deleteDataset

To delete a particular dataset.
This request requires an access token with the datasets:write scope.

**Parameters**

-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.deleteDataset('dataset-id', function(err) {
  if (!err) console.log('deleted!');
});
```

Returns **undefined** nothing, calls callback

# deleteFeature

Delete an existing feature from a dataset.
This request requires an access token with the datasets:write scope.

**Parameters**

-   `id` **string** the `id` of the feature to read
-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.deleteFeature('feature-id', 'dataset-id', function(err, feature) {
  if (!err) console.log('deleted!');
});
```

Returns **undefined** nothing, calls callback

# insertFeature

Insert a feature into a dataset. This can be a new feature, or overwrite an existing one.
If overwriting an existing feature, make sure that the feature's `id` property correctly identifies
the feature you wish to overwrite.
For new features, specifying an `id` is optional. If you do not specify an `id`, one will be assigned
and returned as part of the response.
This request requires an access token with the datasets:write scope.
There are a number of limits to consider when making this request:

-   a single feature cannot be larger than 500 KB
-   the dataset must not exceed 2000 total features
-   the dataset must not exceed a total of 5 MB

**Parameters**

-   `feature` **object** the feature to insert. Must be a valid GeoJSON feature per <http://geojson.org/geojson-spec.html#feature-objects>
-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err, feature)

**Examples**

```javascript
// Insert a brand new feature without an id
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var feature = {
  "type": "Feature",
  "properties": {
    "name": "Null Island"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [0, 0]
  }
};
client.insertFeature(feature, 'dataset-id', function(err, feature) {
  console.log(feature);
  // {
  //   "id": {feature id},
  //   "type": "Feature",
  //   "properties": {
  //     "name": "Null Island"
  //   },
  //   "geometry": {
  //     "type": "Point",
  //     "coordinates": [0, 0]
  //   }
  // }
});
```

```javascript
// Insert a brand new feature with an id, or overwrite an existing feature at that id
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var feature = {
  "id": "feature-id",
  "type": "Feature",
  "properties": {
    "name": "Null Island"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [0, 0]
  }
};
client.insertFeature(feature, 'dataset-id', function(err, feature) {
  console.log(feature);
  // {
  //   "id": "feature-id",
  //   "type": "Feature",
  //   "properties": {
  //     "name": "Null Island"
  //   },
  //   "geometry": {
  //     "type": "Point",
  //     "coordinates": [0, 0]
  //   }
  // }
});
```

Returns **undefined** nothing, calls callback

# listDatasets

To retrieve a listing of datasets for a particular account.
This request requires an access token with the datasets:read scope.

**Parameters**

-   `callback` **Function** called with (err, datasets)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.listDatasets(function(err, datasets) {
  console.log(datasets);
  // [
  //   {
  //     "owner": {account},
  //     "id": {dataset id},
  //     "name": {dataset name},
  //     "description": {dataset description},
  //     "created": {timestamp},
  //     "modified": {timestamp}
  //   },
  //   {
  //     "owner": {account},
  //     "id": {dataset id},
  //     "name": {dataset name},
  //     "description": {dataset description},
  //     "created": {timestamp},
  //     "modified": {timestamp}
  //   }
  // ]
});
```

Returns **undefined** nothing, calls callback

# listFeatures

Retrive a list of the features in a particular dataset. The response body will be a GeoJSON FeatureCollection.
This request requires an access token with the datasets:read scope.

**Parameters**

-   `dataset` **string** the id for an existing dataset
-   `options` **[object]** an object for passing pagination arguments
    -   `options.reverse` **[boolean]** Set to `true` to reverse the default sort order of the listing.
    -   `options.limit` **[number]** The maximum number of objects to return. This value must be between 1 and 100. The API will attempt to return the requested number of objects, but receiving fewer objects does not necessarily signal the end of the collection. Receiving an empty page of results is the only way to determine when you are at the end of a collection.
    -   `options.start` **[string]** The object id that acts as the cursor for pagination and defines your location in the collection. This argument is exclusive so the object associated with the id provided to the start argument will not be included in the response.
-   `callback` **Function** called with (err, collection)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.listFeatures('dataset-id', options, function(err, collection) {
  console.log(collection);
  {
    "type": "FeatureCollection",
    "features": [
      {
        "id": {feature id},
        "type": "Feature",
        "properties": {feature properties}
        "geometry": {feature geometry}
      },
      {
        "id": {feature id},
        "type": "Feature",
        "properties": {feature properties}
        "geometry": {feature geometry}
      }
    ]
  }
});
```

Returns **undefined** nothing, calls callback

# readDataset

To retrieve information about a particular dataset.
This request requires an access token with the datasets:read scope.

**Parameters**

-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err, dataset)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.readDataset('dataset-id', function(err, dataset) {
  console.log(dataset);
  // {
  //   "owner": {account},
  //   "id": "dataset-id",
  //   "name": {dataset name},
  //   "description": {dataset description},
  //   "created": {timestamp},
  //   "modified": {timestamp}
  // }
});
```

Returns **undefined** nothing, calls callback

# readFeature

Read an existing feature from a dataset.
This request requires an access token with the datasets:read scope.

**Parameters**

-   `id` **string** the `id` of the feature to read
-   `dataset` **string** the id for an existing dataset
-   `callback` **Function** called with (err, feature)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
client.readFeature('feature-id', 'dataset-id', function(err, feature) {
  console.log(feature);
  // {
  //   "id": "feature-id",
  //   "type": "Feature",
  //   "properties": {
  //     "name": "Null Island"
  //   },
  //   "geometry": {
  //     "type": "Point",
  //     "coordinates": [0, 0]
  //   }
  // }
});
```

Returns **undefined** nothing, calls callback

# updateDataset

To make updates to a particular dataset's properties.
This request requires an access token with the datasets:write scope.

**Parameters**

-   `dataset` **string** the id for an existing dataset
-   `options` **[object]** an object defining updates to the dataset's properties
    -   `options.name` **[string]** the updated dataset's name
    -   `options.description` **[string]** the updated dataset's description
-   `callback` **Function** called with (err, dataset)

**Examples**

```javascript
var MapboxClient = require('mapbox');
var client = new MapboxClient('ACCESSTOKEN');
var options = { name: 'foo' };
client.updateDataset('dataset-id', options, function(err, dataset) {
  console.log(dataset);
  // {
  //   "owner": {account},
  //   "id": "dataset-id",
  //   "name": "foo",
  //   "description": {dataset description},
  //   "created": {timestamp},
  //   "modified": {timestamp}
  // }
});
```

Returns **undefined** nothing, calls callback

# getTilestats

To retrieve statistics about a specific tileset.

**Parameters**

-   `tileset` **String** the id for the tileset
-   `callback` **Function** called with (err, tilestats)

**Examples**

```javascript
var client = new MapboxClient('ACCESSTOKEN');
client.getTilestats('tileset-id', function(err, info) {
  console.log(info);
  // {
  //   "account": {account},
  //   "tilesetid": "tileset-id",
  //   "layers": [
  //     {
  //       "account": {account},
  //       "tilesetid": "tileset-id",
  //       "layer": {layername},
  //       "count": 10,
  //       "attributes": [
  //         {
  //           "attribute": {attributename},
  //           "min": 0,
  //           "max": 10,
  //           "values": [0, 10]
  //         }
  //       ]
  //     }
  //   ]
  // }
});
```

Returns **undefined** nothing, calls callback

# getTilestatsAttribute

To retrieve statistics about the attribute values of a particular attribute
within a tileset layer.

**Parameters**

-   `tileset` **String** the id for the tileset
-   `layer` **String** the name of the layer in the tileset
-   `attribute` **String** the name of the attribute in the layer
-   `callback` **Function** called with (err)

**Examples**

```javascript
var client = new MapboxClient('ACCESSTOKEN');
client.getTilestatsAttribute('tileset-id', 'layer-name', 'attr-name', function(err, info) {
  console.log(info);
  // {
  //   "account": {account},
  //   "tilesetid": "tileset-id",
  //   "layer": "layer-name",
  //   "attribute": "attr-name",
  //   "type": "Number",
  //   "min": 0,
  //   "max": 10,
  //   "values": [
  //     0,
  //     10
  //   ]
  // }
});
```

Returns **undefined** nothing, calls callback

# createUpload

Create an new upload with a file previously staged on Amazon S3.

This request requires an access token with the uploads:write scope.

**Parameters**

-   `options` **Object** an object that defines the upload's properties
    -   `options.tileset` **String** id of the tileset to create or
        replace. This must consist of an account id and a unique key
        separated by a period. Reuse of a tileset value will overwrite
        existing data. To avoid overwriting existing data, you must ensure
        that you are using unique tileset ids.
    -   `options.url` **String** https url of a file staged on Amazon S3.
-   `callback` **Function** called with (err, upload)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
// Response from a call to createUploadCredentials
var credentials = {
  "accessKeyId": "{accessKeyId}",
  "bucket": "somebucket",
  "key": "hij456",
  "secretAccessKey": "{secretAccessKey}",
  "sessionToken": "{sessionToken}",
  "url": "{s3 url}"
};
mapboxClient.createUpload({
   tileset: [accountid, 'mytileset'].join('.'),
   url: credentials.url
}, function(err, upload) {
  console.log(upload);
  // {
  //   "complete": false,
  //   "tileset": "example.markers",
  //   "error": null,
  //   "id": "hij456",
  //   "modified": "2014-11-21T19:41:10.000Z",
  //   "created": "2014-11-21T19:41:10.000Z",
  //   "owner": "example",
  //   "progress": 0
  // }
});
```

Returns **undefined** nothing, calls callback

# createUploadCredentials

Retrieve credentials that allow a new file to be staged on Amazon S3
while an upload is processed. All uploads must be staged using these
credentials before being uploaded to Mapbox.

This request requires an access token with the uploads:write scope.

**Parameters**

-   `callback` **Function** called with (err, credentials)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.createUploadCredentials(function(err, credentials) {
  console.log(credentials);
  // {
  //   "accessKeyId": "{accessKeyId}",
  //   "bucket": "somebucket",
  //   "key": "hij456",
  //   "secretAccessKey": "{secretAccessKey}",
  //   "sessionToken": "{sessionToken}",
  //   "url": "{s3 url}"
  // }

  // Use aws-sdk to stage the file on Amazon S3
  var AWS = require('aws-sdk');
  var s3 = new AWS.S3({
       accessKeyId: credentials.accessKeyId,
       secretAccessKey: credentials.secretAccessKey,
       sessionToken: credentials.sessionToken,
       region: 'us-east-1'
  });
  s3.putObject({
    Bucket: credentials.bucket,
    Key: credentials.key,
    Body: fs.createReadStream('/path/to/file.mbtiles')
  }, function(err, resp) {
  });
});
```

Returns **undefined** nothing, calls callback

# deleteUpload

Delete a completed upload. In-progress uploads cannot be deleted.

This request requires an access token with the uploads:delete scope.

**Parameters**

-   `upload`  
-   `callback` **Function** called with (err)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.deleteUpload('hij456', function(err) {
});
```

Returns **undefined** nothing, calls callback

# listUploads

Retrieve a listing of uploads for a particular account.

This request requires an access token with the uploads:list scope.

**Parameters**

-   `callback` **Function** called with (err, uploads)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.listUploads(function(err, uploads) {
  console.log(uploads);
  // [
  //   {
  //     "complete": true,
  //     "tileset": "example.mbtiles",
  //     "error": null,
  //     "id": "abc123",
  //     "modified": "2014-11-21T19:41:10.000Z",
  //     "created": "2014-11-21T19:41:10.000Z",
  //     "owner": "example",
  //     "progress": 1
  //   },
  //   {
  //     "complete": false,
  //     "tileset": "example.foo",
  //     "error": null,
  //     "id": "xyz789",
  //     "modified": "2014-11-21T19:41:10.000Z",
  //     "created": "2014-11-21T19:41:10.000Z",
  //     "owner": "example",
  //     "progress": 0
  //   }
  // ]
});
```

Returns **undefined** nothing, calls callback

# readUpload

Retrieve state of an upload.

This request requires an access token with the uploads:read scope.

**Parameters**

-   `upload` **String** id of the upload to read
-   `callback` **Function** called with (err, upload)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.readUpload('hij456', function(err, upload) {
  console.log(upload);
  // {
  //   "complete": true,
  //   "tileset": "example.markers",
  //   "error": null,
  //   "id": "hij456",
  //   "modified": "2014-11-21T19:41:10.000Z",
  //   "created": "2014-11-21T19:41:10.000Z",
  //   "owner": "example",
  //   "progress": 1
  // }
});
```

Returns **undefined** nothing, calls callback

# MapboxClient

The JavaScript API to Mapbox services

**Parameters**

-   `accessToken` **string** a private or public access token
-   `options` **Object** additional options provided for configuration
    -   `options.endpoint` **[string]** location
        of the Mapbox API pointed-to. This can be customized to point to a
        Mapbox Atlas Server instance, or a different service, a mock,
        or a staging endpoint. Usually you don't need to customize this. (optional, default `https://api.mapbox.com`)
    -   `options.account` **[string]** account id to use for api
        requests. If not is specified, the account defaults to the owner
        of the provided accessToken.

**Examples**

```javascript
var client = new MapboxClient('ACCESSTOKEN');
```

## geocodeForward

Search for a location with a string, using the
[Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).

**Parameters**

-   `query` **string** desired location
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.proximity` **Object** a proximity argument: this is
        a geographical point given as an object with latitude and longitude
        properties. Search results closer to this point will be given
        higher priority.
    -   `options.types` **string** a comma seperated list of types that filter
        results to match those specified. See <https://www.mapbox.com/developers/api/geocoding/#filter-type>
        for available types.
    -   `options.country` **string** a comma seperated list of country codes to
        limit results to specified country or countries.
    -   `options.dataset` **[string]** the desired data to be
        geocoded against. The default, mapbox.places, does not permit unlimited
        caching. `mapbox.places-permanent` is available on request and does
        permit permanent caching. (optional, default `mapbox.places`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
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

Returns **undefined** nothing, calls callback

## getDirections

Find directions from A to B, or between any number of locations.
Consult the [Mapbox Directions API](https://www.mapbox.com/developers/api/directions/)
for more documentation.

**Parameters**

-   `waypoints` **Array&lt;Object&gt;** an array of objects with `latitude`
    and `longitude` properties that represent waypoints in order. Up to
    25 waypoints can be specified.
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.profile` **[string]** the directions
        profile, which determines how to prioritize different routes.
        Options are `'mapbox.driving'`, which assumes transportation via an
        automobile and will use highways, `'mapbox.walking'`, which avoids
        streets without sidewalks, and `'mapbox.cycling'`, which prefers streets
        with bicycle lanes and lower speed limits for transportation via
        bicycle. (optional, default `mapbox.driving`)
    -   `options.alternatives` **[string]** whether to generate
        alternative routes along with the preferred route. (optional, default `true`)
    -   `options.instructions` **[string]** format for turn-by-turn
        instructions along the route. (optional, default `text`)
    -   `options.geometry` **[string]** format for the returned
        route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline`
        yields more compact responses which can be decoded on the client side.
        [GeoJSON](http://geojson.org/), the default, is compatible with libraries
        like [Mapbox GL](https://www.mapbox.com/mapbox-gl/),
        Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false`
        omits the geometry entirely and only returns instructions. (optional, default `geojson`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
mapboxClient.getDirections(
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

Returns **undefined** nothing, calls callback

## getDistances

Compute a table of travel-time estimates between a set of waypoints.
Consult the [Mapbox Distance API](https://www.mapbox.com/developers/api/distance/)
for more documentation.

**Parameters**

-   `waypoints` **Array&lt;Array&lt;number&gt;&gt;** an array of coordinate pairs
    in [longitude, latitude] order. Up to
    100 waypoints can be specified.
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.profile` **[string]** the directions
        profile, which determines how to prioritize different routes.
        Options are `'driving'`, which assumes transportation via an
        automobile and will use highways, `'walking'`, which avoids
        streets without sidewalks, and `'cycling'`, which prefers streets
        with bicycle lanes and lower speed limits for transportation via
        bicycle. (optional, default `driving`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
// With options
mapboxClient.getDistances([
  [-95.4431142, 33.6875431],
  [-95.0431142, 33.6875431],
  [-95.0431142, 33.0875431],
  [-95.0431142, 33.0175431],
  [-95.4831142, 33.6875431]
], {
  profile: 'walking'
}, function(err, results) {
  console.log(results);
});

// Results is an object like:
{ durations:
  [ [ 0, 1196, 3977, 3415, 5196 ],
    [ 1207, 0, 3775, 3213, 4993 ],
    [ 3976, 3774, 0, 2650, 2579 ],
    [ 3415, 3212, 2650, 0, 3869 ],
    [ 5208, 5006, 2579, 3882, 0 ] ] }

// If the coordinates include an un-routable place, then
// the table may contain 'null' values to indicate this, like
{ durations:
  [ [ 0, 11642, 57965, null, 72782 ],
    [ 11642, 0, 56394, null, 69918 ],
    [ 57965, 56394, 0, null, 19284 ],
    [ null, null, null, 0, null ],
    [ 72782, 69918, 19284, null, 0 ] ] }
```

Returns **undefined** nothing, calls callback

## matching

Snap recorded location traces to roads and paths from OpenStreetMap.
Consult the [Map Matching API](https://www.mapbox.com/developers/api/map-matching/)
for more documentation.

**Parameters**

-   `trace` **Object** a single [GeoJSON](http://geojson.org/)
    Feature with a LineString geometry, containing up to 100 positions.
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.profile` **[string]** the directions
        profile, which determines how to prioritize different routes.
        Options are `'mapbox.driving'`, which assumes transportation via an
        automobile and will use highways, `'mapbox.walking'`, which avoids
        streets without sidewalks, and `'mapbox.cycling'`, which prefers streets
        with bicycle lanes and lower speed limits for transportation via
        bicycle. (optional, default `mapbox.driving`)
    -   `options.geometry` **[string]** format for the returned
        route. Options are `'geojson'`, `'polyline'`, or `false`: `polyline`
        yields more compact responses which can be decoded on the client side.
        [GeoJSON](http://geojson.org/), the default, is compatible with libraries
        like [Mapbox GL](https://www.mapbox.com/mapbox-gl/),
        Leaflet and [Mapbox.js](https://www.mapbox.com/mapbox.js/). `false`
        omits the geometry entirely and only returns matched points. (optional, default `geojson`)
    -   `options.gps_precision` **[number]** An integer in meters indicating
        the assumed precision of the used tracking device. Use higher
        numbers (5-10) for noisy traces and lower numbers (1-3) for clean
        traces. The default value is 4. (optional, default `4`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
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

Returns **undefined** nothing, calls callback

## surface

Given a list of locations, retrieve vector tiles, find the nearest
spatial features, extract their data values, and then absolute values and
optionally interpolated values in-between, if the interpolate option is specified.

Consult the [Surface API](https://www.mapbox.com/developers/api/surface/)
for more documentation.

**Parameters**

-   `mapid` **string** a Mapbox mapid containing vector tiles against
    which we'll query
-   `layer` **string** layer within the given `mapid` for which to pull
    data
-   `fields` **Array&lt;string&gt;** layer within the given `mapid` for which to pull
    data
-   `path` **Array&lt;Object&gt; or string** either an encoded polyline,
    provided as a string, or an array of objects with longitude and latitude
    properties, similar to waypoints.
-   `options` **[Object]** additional options meant to tune
    the request (optional, default `{}`)
    -   `options.geojson` **[string]** whether to return data as a
        GeoJSON point (optional, default `false`)
    -   `options.zoom` **[string]** zoom level at which features
        are queried (optional, default `maximum`)
    -   `options.interpolate` **[boolean]** Whether to interpolate
        between matches in the feature collection. (optional, default `true`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var mapboxClient = new MapboxClient('ACCESSTOKEN');
```

Returns **undefined** nothing, calls callback

# geocodeReverse

Given a location, determine what geographical features are located
there. This uses the [Mapbox Geocoding API](https://www.mapbox.com/developers/api/geocoding/).

**Parameters**

-   `location` **Object** the geographical point to search
    -   `location.latitude` **number** decimal degrees latitude, in range -90 to 90
    -   `location.longitude` **number** decimal degrees longitude, in range -180 to 180
-   `options` **[Object]** additional options meant to tune
    the request. (optional, default `{}`)
    -   `options.types` **string** a comma seperated list of types that filter
        results to match those specified. See <https://www.mapbox.com/developers/api/geocoding/#filter-type>
        for available types.
    -   `options.dataset` **[string]** the desired data to be
        geocoded against. The default, mapbox.places, does not permit unlimited
        caching. `mapbox.places-permanent` is available on request and does
        permit permanent caching. (optional, default `mapbox.places`)
-   `callback` **Function** called with (err, results)

**Examples**

```javascript
var mapboxClient = new MapboxGeocoding('ACCESSTOKEN');
mapboxClient.geocodeReverse(
  { latitude: 33.6875431, longitude: -95.4431142 },
  function(err, res) {
  // res is a GeoJSON document with geocoding matches
});
```

Returns **undefined** nothing, calls callback
