_[How to report a bug](http://polite.technology/reportabug.html)_

## Contributing

To test the Mapbox JavaScript SDK, you'll need all of the dependencies for
development (git, npm, node), and a valid Mapbox access token that has
access to all tested services.

Clone this repository

```sh
$ git clone https://github.com/mapbox/mapbox-sdk-js.git
$ cd mapbox-sdk-js
```

Install dependencies

```sh
$ npm install
```

Set the access token in your environment

```sh
$ export MapboxAccessToken=YOUR_ACCESS_TOKEN_HERE
```

Run the tests

```sh
$ npm test
```

## Releasing

- `npm run prepublish && npm run docs`
- Update the version key in [package.json](https://github.com/mapbox/mapbox-sdk-js/blob/master/package.json#L3)
- Outline changes in [CHANGELOG.md](https://github.com/mapbox/mapbox-sdk-js/blob/master/CHANGELOG.md)
- Commit and push
- `git tag -a vX.X.X -m 'vX.X.X'`
- `git push --tags`
- `npm publish`
