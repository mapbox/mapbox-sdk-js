'use strict';

var v = {};

v.validate = function(schema, config) {
  config = config || {};
  var configKeys = Object.keys(config);
  var schemaKeys = Object.keys(schema);
  configKeys.forEach(function(configKey) {
    if (!schema[configKey]) {
      throw new Error(configKey + ' is not a valid option');
    }
  });
  schemaKeys.forEach(function(schemaKey) {
    var schemaValue = schema[schemaKey];
    if (!Array.isArray(schemaValue)) {
      schemaValue(config, schemaKey);
      return;
    }
    schemaValue.forEach(function(check) {
      check(config, schemaKey);
    });
  });
};

v.oneOf = function(options) {
  if (!Array.isArray(options)) {
    throw new Error('oneOf expects an array');
  }
  var checks = [];
  options.forEach(function(option) {
    if (!option || !option.__check) {
      throw new Error(option + ' is not a valid option');
    }
    checks.push(option.__check);
  });

  return wrapCheck(function(value) {
    var messages = checks
      .map(function(check) {
        return check(value);
      })
      .filter(function(message) {
        return message;
      });

    // no match
    if (messages.length === checks.length) {
      return messages.join(' or ');
    }
  });
};

v.arrayOf = function(option) {
  if (!option || !(option.__check || option.__required_check)) {
    throw new Error(option + ' is not a valid option');
  }

  var check = option.__check;
  var required = false;

  if (option.__required_check) {
    check = option.__required_check;
    required = true;
  }

  return wrapCheck(function(values) {
    if (required && values == null) {
      return 'is required';
    }

    // prevents values other than null,undefined,Array when required==false
    if (values != null && !Array.isArray(values)) {
      return 'must be an array';
    }

    if (Array.isArray(values)) {
      var message = values
        .map(function(val) {
          return check(val);
        })
        .find(function(message) {
          return message;
        });

      if (message) {
        return "array's every element " + message;
      }
    }
  });
};

v.string = wrapCheck(function(value) {
  if (typeof value !== 'string') {
    return 'must be a string';
  }
});

v.number = wrapCheck(function(value) {
  if (typeof value !== 'number') {
    return 'must be a number';
  }
});

v.boolean = wrapCheck(function(value) {
  if (typeof value !== 'boolean') {
    return 'must be a boolean';
  }
});

v.date = wrapCheck(function(value) {
  var msg = 'must be a date';
  if (typeof value === 'boolean') {
    return msg;
  }
  try {
    var date = new Date(value);
    if (date.getTime && isNaN(date.getTime())) {
      return msg;
    }
  } catch (e) {
    return msg;
  }
});

v.plainObject = wrapCheck(function(value) {
  if (typeof value !== 'object' || Array.isArray(value)) {
    return 'must be an object';
  }
});

v.arrayOfStrings = wrapCheck(function(value) {
  if (
    !Array.isArray(value) ||
    !value.every(function(x) {
      return typeof x === 'string';
    })
  ) {
    return 'must be an array of strings';
  }
});

v.arrayOfObjects = wrapCheck(function(value) {
  if (
    !Array.isArray(value) ||
    !value.every(function(x) {
      return typeof x === 'object';
    })
  ) {
    return 'must be an array of objects';
  }
});

v.file = wrapCheck(function(value) {
  // If we're in a browser so Blob is available, the file must be that.
  // In Node, however, it could be a filepath or a pipeable (Readable) stream.
  if (typeof window !== 'undefined') {
    if (value instanceof global.Blob || value instanceof global.ArrayBuffer) {
      return;
    }
    return 'must be a Blob or ArrayBuffer';
  }
  if (typeof value === 'string' || value.pipe !== undefined) {
    return;
  }
  return 'must be a filename or Readable stream';
});

function required(value) {
  if (isEmpty(value)) {
    return 'is required';
  }
}
var wrappedRequired = wrapCheck(required);

function isEmpty(value) {
  return value === undefined || value === null;
}

function wrapCheck(check) {
  function wrapped(config, key) {
    var value = config[key];
    if (check !== required && isEmpty(value)) {
      return;
    }
    var msg = check(value);
    if (msg) {
      throw new Error(key + ' ' + msg);
    }
  }
  wrapped.required = function(config, key) {
    wrappedRequired(config, key);
    wrapped(config, key);
  };

  wrapped.required.__required_check = check;

  wrapped.__check = check;

  return wrapped;
}

module.exports = v;
