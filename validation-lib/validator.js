'use strict';
/**
 * Validators are functions which assert certain type.
 * They can return a string which can then be used
 * to display a helpful error message.
 * They can also return a function for a custom error message.
 */
var isPlainObject = require('is-plain-obj');
var xtend = require('xtend');

var v = {};

/**
 * Runners
 *
 * Take root validators and run assertion
 */
v.assert = function(rootValidator, options) {
  options = options || {};
  return function(value) {
    var message = validate(rootValidator, value);
    // all good
    if (!message) {
      return;
    }

    var errorMessage = processMessage(message, options);

    if (options.apiName) {
      errorMessage = options.apiName + ': ' + errorMessage;
    }

    throw new Error(errorMessage);
  };
};

/**
 * Higher Order Validators
 *
 * validators which take other validators as input
 * and output a new validator
 */
v.shape = function shape(validatorObj) {
  var validators = objectEntries(validatorObj);
  return function shapeValidator(value) {
    var validationResult = validate(v.plainObject, value);

    if (validationResult) {
      return validationResult;
    }

    var key, validator;
    var errorMessages = [];

    for (var i = 0; i < validators.length; i++) {
      key = validators[i].key;
      validator = validators[i].value;
      validationResult = validate(validator, value[key]);

      if (validationResult) {
        // return [key].concat(validationResult);
        errorMessages.push([key].concat(validationResult));
      }
    }

    if (errorMessages.length < 2) {
      return errorMessages[0];
    }

    // enumerate all the error messages
    return function(options) {
      var indent = '\n      ';
      errorMessages = errorMessages.map(function(message) {
        return (
          '>' +
          message[0] +
          ': ' +
          processMessage(message, options)
            .split('\n')
            .join(indent) // indents any inner nesting
        );
      });

      return (
        'The following keys of ' +
        options.path.join('.') +
        ' did not pass validation:' +
        '\n' +
        indent +
        errorMessages.join('\n' + indent)
      );
    };
  };
};

v.arrayOf = function arrayOf(validator) {
  return function arrayOfValidator(value) {
    var validationResult = validate(v.plainArray, value);

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

v.required = function required(validator) {
  function requiredValidator(value) {
    if (value == null) {
      return function(options) {
        return formatErrorMessage(
          options,
          isArrayCulprit(options.path)
            ? 'cannot be undefined/null.'
            : 'is required.'
        );
      };
    }
    return validator.apply(this, arguments);
  }
  requiredValidator.__required = true;

  return requiredValidator;
};

v.oneOfType = function oneOfType() {
  var validators = Array.isArray(arguments[0])
    ? arguments[0]
    : Array.prototype.slice.call(arguments);
  return function oneOfTypeValidator(value) {
    var messages = validators
      .map(function(validator) {
        return validate(validator, value);
      })
      .filter(function(message) {
        return !!message;
      });

    // If we don't have as many messages as no. of validators,
    // then at least one validator was ok with the value.
    if (messages.length !== validators.length) {
      return;
    }

    // check primitive type
    if (
      messages.every(function(message) {
        return message.length === 1 && typeof message[0] === 'string';
      })
    ) {
      return orList(
        messages.map(function(m) {
          return m[0];
        })
      );
    }

    // Complex oneOfTypes like
    // `v.oneOftypes(v.shape({name: v.string})`, `v.shape({name: v.number}))`
    // are complex ¯\_(ツ)_/¯. For the current scope only returning the longest message.
    return messages.reduce(function(max, arr) {
      return arr.length > max.length ? arr : max;
    });
  };
};

/**
 * Meta Validators
 * which take options as argument (not validators)
 * and return a new primitive validator
 */
v.equal = function equal(compareWith) {
  return function equalValidator(value) {
    if (value !== compareWith) {
      return JSON.stringify(compareWith);
    }
  };
};

v.oneOf = function oneOf() {
  var options = Array.isArray(arguments[0])
    ? arguments[0]
    : Array.prototype.slice.call(arguments);
  var validators = options.map(function(value) {
    return v.equal(value);
  });

  return v.oneOfType.apply(this, validators);
};

v.range = function range(compareWith) {
  var min = compareWith[0];
  var max = compareWith[1];
  return function rangeValidator(value) {
    var validationResult = validate(v.number, value);

    if (validationResult || value < min || value > max) {
      return 'number between ' + min + ' & ' + max + ' (inclusive)';
    }
  };
};

/**
 * Primitive validators
 *
 * simple validators which return a string or undefined
 */
v.boolean = function boolean(value) {
  if (typeof value !== 'boolean') {
    return 'boolean';
  }
};

v.number = function number(value) {
  if (typeof value !== 'number') {
    return 'number';
  }
};

v.plainArray = function plainArray(value) {
  if (!Array.isArray(value)) {
    return 'array';
  }
};

v.plainObject = function plainObject(value) {
  if (!isPlainObject(value)) {
    return 'object';
  }
};

v.string = function string(value) {
  if (typeof value !== 'string') {
    return 'string';
  }
};

v.date = function date(value) {
  var msg = 'date';
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
};

v.coordinates = function coordinates(value) {
  var validationResult =
    validate(v.arrayOf(v.number), value) ||
    validate(v.range([-180, 180]), value[0]) ||
    validate(v.range([-90, 90]), value[1]);

  if (validationResult || value.length !== 2) {
    return 'array of [longitude, latitude]';
  }
};

function validate(validator, value) {
  // assertions are optional by default unless wrapped in v.require
  if (value == null && !validator.hasOwnProperty('__required')) {
    return;
  }

  var result = validator(value);

  if (result) {
    return Array.isArray(result) ? result : [result];
  }
}

function processMessage(message, options) {
  // message array follows the convention
  // [...path, result]
  // path is an array of object keys / array indices
  // result is output of the validator
  var len = message.length;

  var result = message[len - 1];
  var path = message.slice(0, len - 1);

  if (path.length === 0) {
    // Calling it value since there is no identifiable path
    path = ['value'];
  }
  options = xtend(options, { path: path });

  return typeof result === 'function'
    ? result(options) // allows customization of result
    : formatErrorMessage(options, prettifyResult(result));
}

function orList(list) {
  if (list.length < 2) {
    return list[0];
  }
  return [list.slice(0, list.length - 1).join(', ')]
    .concat(list.slice(list.length - 1))
    .join(' or ');
}

function prettifyResult(result) {
  return 'must be ' + (/^[aeiou]/.test(result) ? 'an ' : 'a ') + result + '.';
}

function formatErrorMessage(options, prettyResult) {
  var arrayCulprit = isArrayCulprit(options.path);
  var output = options.path.join('.') + ' ' + prettyResult;
  var prepend = arrayCulprit ? 'Item at position ' : '';

  return prepend + output;
}

function isArrayCulprit(path) {
  return typeof path[path.length - 1] == 'number' || typeof path[0] == 'number';
}

function objectEntries(obj) {
  return Object.keys(obj || {}).map(function(key) {
    return { key: key, value: obj[key] };
  });
}

v.validate = validate;
v.processMessage = processMessage;

module.exports = v;
