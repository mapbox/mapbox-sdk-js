# Development

## Service method naming conventions

- Each method name should contain a verb and the object of that verb.
- The following verbs should be used for each method type:
  - `get` and `list` for `GET` requests
  - `create` for `POST` requests
  - `update` for `PATCH` requests
  - `put` for `PUT` requests
  - `delete` for `DELETE` requests
- Only used special verbs when a clear title can't be constructed from the above verbs.

## Test coverage reporting

To check test coverage, run Jest with the `--coverage` flag. You can do this for a single run (e.g. `npx jest --coverage`) or while watching (e.g. `npx jest --watchAll --coverage`).

Coverage data is output to the console and written to the `coverage/` directory. You can `open coverage/index.html` to check out the wonderful HTML report and find the lines that still need coverage.

## Creating a service

First you'll create a service prototype object, then you'll pass that prototype object into the [`createServiceFactory()`](../services/service-helpers/create-service-factory.js) function.

The properties of a service prototype object are the service methods. Each service method is a function that accepts a configuration object and returns a `MapiRequest`. The request should be created using `this.client.createRequest()`, which accepts an object with the following properties:

- `method` (string): the HTTP method (e.g. `GET`).
- `path` (string): the path of the endpoint, with `:express-style` colon-prefixed parameters for path parts that should be replaced by values in the `params` object.
- `params` (object): an object whose keys correspond to the `:express-style` colon-prefixed parameters in the `path` string, and whose values are the values that should be substituted into the path. For example, with `path: '/foo/:bar/:baz'` you'll need a params object with `bar` and `baz` properties, like `{ bar: 'a', baz: 'b' }`. **You do *not* need to specify an `ownerId` param: that is automatically provided by the `MapiClient`.**
- `query` (object): an object that will be transformed into a query string and attached to the `path` (e.g. `{ foo: 'a', baz: 'b' }` becomes `?foo=a&baz=b`).
- `headers` (object): an object of headers that should be added to the request. Keys should be lowercase. `'content-type': 'application/json'` is automatically included if the request includes a `body`.
- `body` (object, default `null`): a body that should be included with the `POST` or `PUT` request. It will be stringified as JSON.
- `file` (Blob|ArrayBuffer|string|ReadStream): a file that should be included with the `POST` or `PUT` request.

`createServiceFactory` sets `this.client`, so the service can make requests tailored to the user's `MapiClient`.

We use [Fusspot](https://github.com/mapbox/fusspot) for run-time validation of service method configuration.

Here's an example of a minimal fake service:

```js
var createServiceFactory = require('../path/to/service-helpers/create-service-factory');

var Animals = {};

Animals.listAnimals = function() {
  return this.client.createRequest({
    method: 'GET',
    path: '/animals/v1/:ownerId'
  });
};

Animals.deleteAnimal = function(config) {
  // Here you can make assertions against config.

  return this.client.createRequest({
    method: 'DELETE',
    path: '/animals/v1/:ownerId/:animalId',
    params: { animalId: config.animalId }
  });
};

var AnimalsService = createServiceFactory(Animals);
```
