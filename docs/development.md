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
