/*
 * xtend by Jake Verbaten
 *
 * Licensed under MIT
 * https://github.com/Raynos/xtend
 */
module.exports.extendMutable = extendMutable
module.exports.extend = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extendMutable(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}


function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}
