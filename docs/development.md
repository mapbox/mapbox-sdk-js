# Development

## Service method naming conventions

- Each method name should contain a verb and the object of that verb.
- The following verbs should be used for each method type:
  - `get` and `list` for `GET` requests
  - `create` for `POST` requests
  - `update` for `PATCH` and `PUT` requests
  - `delete` for `DELETE` requests
- Only used special verbs when a clear title can't be constructed from the above verbs.
