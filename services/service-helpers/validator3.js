'use strict';
/**
 * Validators are functions which assert certain type.
 * They can return a string which is generally a simple
 * type which can then be used to display a helpful error message.
 * They can also return a function for a more complicated
 * error message.
 */
var isPlainObject = require('is-plain-obj');

var v = {};

function formatMessage(apiName, message) {
  apiName = apiName ? apiName + ';' : '';
  return apiName + 'Validation failed! ' + message;
}

function objectEntries(obj) {
  return Object.keys(obj || {}).map(function(key) {
    return { key: key, val: obj[key] };
  });
}

v.warn = function(rootValidator, apiName) {
  return function(value) {
    var messages = validate(rootValidator, value);
    // all good
    if (!messages) {
      return;
    }

    var len = messages.length;
    // this where the validator assertion is
    var lastElement = messages[len - 1];
    var path = messages.slice(0, len - 1);

    if (path.length == 0) {
      // Calling it value since there is no identifiable path
      path = ['value'];
    }

    var errorMessage;

    if (typeof lastElement == 'function') {
      errorMessage = lastElement(apiName, path);
    } else {
      var startWith = '';
      // an array item is invalid
      if (
        typeof path[path.length - 1] == 'number' ||
        typeof path[0] == 'number'
      ) {
        startWith = 'item at position ';
      }

      errorMessage = formatMessage(
        apiName,
        startWith + path.join('.') + ' must be ' + lastElement
      );
    }

    throw new Error(errorMessage);
  };
};

function validate(validator, value) {
  if (value == null && !validator.hasOwnProperty('__required')) {
    return;
  }

  var result = validator(value);

  if (result) {
    return Array.isArray(result) ? result : [result];
  }
}

v.shapeOf = function shapeOf(validatorObj) {
  var validatorZipped = objectEntries(validatorObj);
  return function shapeOfValidator(value) {
    var validationResult = validate(v.plainObject, value);

    if (validationResult) {
      return validationResult;
    }

    for (var i = 0; i < validatorZipped.length; i++) {
      var key = validatorZipped[i].key;
      var validator = validatorZipped[i].val;

      validationResult = validate(validator, value[key]);

      if (validationResult) {
        return [key].concat(validationResult);
      }
    }
  };
};

v.arrayOf = function arrayOf(validator) {
  return function arrayOfValidator(value) {
    var validationResult = validate(v.array, value);

    if (validationResult) {
      return validationResult;
    }

    for (var i = 0; i < value.length; i++) {
      validationResult = validate(validator, value[i]);

      if (validationResult) {
        return [i].concat(validationResult);
      }
    }
  };
};

v.plainObject = function plainObject(value) {
  if (!isPlainObject(value)) {
    return 'object';
  }
};

v.req = function req(validator) {
  var requiredValidator = function requiredValidator(value) {
    if (value == null) {
      return function(apiName, path) {
        // an array item is invalid
        if (
          typeof path[path.length - 1] == 'number' ||
          typeof path[0] == 'number'
        ) {
          return formatMessage(
            apiName,
            'item at position ' + path.join('.') + ' cannot be undefined/null'
          );
        }
        return formatMessage(apiName, path.join('.') + ' is required');
      };
    }
    return validator.apply(this, arguments);
  };

  requiredValidator.__required = true;

  return requiredValidator;
};

v.nil = function nil(value) {
  if (value != null) {
    return 'null/undefined';
  }
};

v.str = function str(value) {
  if (typeof value !== 'string') {
    return 'string';
  }
};

v.number = function number(value) {
  if (typeof value !== 'number') {
    return 'a number';
  }
};

v.array = function array(value) {
  if (!Array.isArray(value)) {
    return 'array';
  }
};

module.exports = { v: v };
