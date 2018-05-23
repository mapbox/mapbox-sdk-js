'use strict';

var isPlainObject = require('is-plain-obj');

var v = {};

function validateObject(schema, value) {
  var valueKeys = Object.keys(value);
  var schemaKeys = Object.keys(schema);
  valueKeys.forEach(function(valueKey) {
    if (!schema[valueKey]) {
      throw new Error(valueKey + ' is not a valid option');
    }
  });
  schemaKeys.forEach(function(schemaKey) {
    var validate = schema[schemaKey];
    var propertyValue = value[schemaKey];
    var msg = validate(propertyValue, schemaKey);
    if (msg) {
      complain(msg, schemaKey);
    }
  });
}

function validateNonObject(validate, value) {
  var msg = validate(value);
  if (msg) {
    complain(msg);
  }
}

function complain(msg, key) {
  if (key) {
    throw new Error(key + ' must be ' + msg);
  }
  throw new Error('expected ' + msg);
}

v.validate = function(a, b) {
  if (isPlainObject(b)) {
    validateObject(a, b);
  } else {
    validateNonObject(a, b);
  }
};

v.string = wrapValidate(function string(value) {
  if (typeof value !== 'string') {
    return 'a string';
  }
});

v.number = wrapValidate(function number(value) {
  if (typeof value !== 'number') {
    return 'a number';
  }
});

v.boolean = wrapValidate(function boolean(value) {
  if (typeof value !== 'boolean') {
    return 'a boolean';
  }
});

v.date = wrapValidate(function date(value) {
  var msg = 'a date';
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

v.file = wrapValidate(function file(value) {
  // If we're in a browser so Blob is available, the file must be that.
  // In Node, however, it could be a filepath or a pipeable (Readable) stream.
  if (typeof window !== 'undefined') {
    if (value instanceof global.Blob || value instanceof global.ArrayBuffer) {
      return;
    }
    return 'a Blob or ArrayBuffer';
  }
  if (typeof value === 'string' || value.pipe !== undefined) {
    return;
  }
  return 'a filename or Readable stream';
});

v.plainObject = wrapValidate(function plainObject(value) {
  if (!isPlainObject(value)) {
    return 'an object';
  }
});

v.range = wrapValidateWithArguments(function numberGreaterThan(value, args) {
  var min = args[0];
  var max = args[1];
  if (typeof value !== 'number' || value < min || value > max) {
    return 'a number between ' + min + ' and ' + max + ', inclusive';
  }
});

v.coordinates = wrapValidate(function coordinates(value) {
  if (
    !Array.isArray(value) ||
    !!v.range(-180, 180)(value[0]) ||
    !!v.range(-90, 90)(value[1])
  ) {
    return 'an array of [longitude, latitude]';
  }
});

v.oneOf = wrapValidateWithArguments(function oneOf(value, options) {
  for (var i = 0; i < options.length; i++) {
    if (value === options[i]) {
      return;
    }
  }
  return orList(options.map(JSON.stringify));
});

v.oneOfType = wrapValidateWithArguments(function oneOfType(
  value,
  wrappedCheckers
) {
  var messages = wrappedCheckers
    .map(function(wrappedChecker) {
      return wrappedChecker(value);
    })
    .filter(function(message) {
      return !!message;
    });

  // If we don't have as many messages as wrappedCheckers,
  // then at least one wrappedChecker was ok with the value.
  if (messages.length !== wrappedCheckers.length) {
    return;
  }

  return orList(messages);
});

v.arrayOf = wrapValidateWithArguments(function arrayOf(value, args) {
  if (!Array.isArray(value)) {
    return 'an array';
  }
  var itemValidator = args[0];
  var message;
  for (var i = 0; i < value.length; i++) {
    message = itemValidator(value[i]);
    if (message) {
      return 'an array whose every item is ' + message;
    }
  }
});

v.required = function wrappedRequired(validate) {
  return function required(value, key) {
    if (isEmpty(value)) {
      throw new Error(key + ' is required');
    }
    validate(value, key);
  };
};

function isEmpty(value) {
  return value === undefined || value === null;
}

function wrapValidate(validate) {
  return function wrappedValidate(value) {
    if (isEmpty(value)) {
      return;
    }
    return validate(value);
  };
}

function wrapValidateWithArguments(validate) {
  return function wrappedValidateWithArguments() {
    var args = Array.prototype.slice.call(arguments);
    return function(value) {
      if (isEmpty(value)) {
        return;
      }
      return validate(value, args);
    };
  };
}

function orList(list) {
  if (list.length === 1) {
    return list;
  }
  if (list.length === 2) {
    return list.join(' or ');
  }
  return list
    .map(function(item, index) {
      if (index === list.length - 1) {
        return 'or ' + item;
      }
      return item;
    })
    .join(', ');
}

module.exports = v;
