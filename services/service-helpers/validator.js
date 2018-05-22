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

v.oneOf = function() {
  var possibilities = Array.prototype.slice.call(arguments);
  return wrapCheck(function(value) {
    for (var i = 0; i < possibilities.length; i++) {
      if (value === possibilities[i]) {
        return;
      }
    }
    return 'must be one of ' + possibilities.join(', ');
  });
};

v.oneOfType = function() {
  var options = Array.prototype.slice.call(arguments);

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
      return messages
        .map(function(m, index) {
          return index === 0 ? m : m.replace(/^must be /g, '');
        })
        .join(' or ');
    }
  });
};

v.arrayOf = function(option) {
  var check = option.__check;

  return wrapCheck(function(values) {
    // prevents values other than null,undefined,Array
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
        return 'must be an array whose every element ' + message;
      }
    }
  });
};

v.stringOrArrayOfStrings = wrapCheck(function(value) {
  if (typeof value === 'string') {
    return;
  }
  if (
    Array.isArray(value) &&
    value.every(function(x) {
      return typeof x === 'string';
    })
  ) {
    return;
  }
  return 'must be a string or an array of strings';
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

  // appending a private property which can then be used by validators
  // which internally use simpler validators.
  wrapped.required.__check = check;
  wrapped.__check = check;

  return wrapped;
}

module.exports = v;
