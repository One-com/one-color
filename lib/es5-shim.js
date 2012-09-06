// This is copied from es5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
(function () {
    var prepareString = "a"[0] !== "a",
        // ES5 9.9
        // http://es5.github.com/#x9.9
        toObject = function (o) {
            if (o === null) { // this matches both null and undefined
                throw new TypeError("can't convert " + o + " to object");
            }
            // If the implementation doesn't support by-index access of
            // string characters (ex. IE < 9), split the string
            if (prepareString && typeof o === "string" && o) {
                return o.split("");
            }
            return new Object(o);
        };


    // ES5 15.4.4.18
    // http://es5.github.com/#x15.4.4.18
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function forEach(fun /*, thisp*/) {
            var self = toObject(this),
                thisp = arguments[1],
                i = -1,
                length = self.length >>> 0;

            // If no callback function or if callback is not a callable function
            if (typeof fun !== "function") {
                throw new TypeError(); // TODO message
            }

            while (++i < length) {
                if (i in self) {
                    // Invoke the callback function with call, passing arguments:
                    // context, property value, property key, thisArg object context
                    fun.call(thisp, self[i], i, self);
                }
            }
        };
    }

    // ES5 15.4.4.19
    // http://es5.github.com/#x15.4.4.19
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
    if (!Array.prototype.map) {
        Array.prototype.map = function map(fun /*, thisp*/) {
            var self = toObject(this),
                length = self.length >>> 0,
                result = new Array(length),
                thisp = arguments[1],
                i;

            // If no callback function or if callback is not a callable function
            if (typeof fun !== "function") {
                throw new TypeError(fun + " is not a function");
            }

            for (i = 0; i < length; i += 1) {
                if (i in self) {
                    result[i] = fun.call(thisp, self[i], i, self);
                }
            }
            return result;
        };
    }

    // ES5 15.4.4.20
    // http://es5.github.com/#x15.4.4.20
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
    if (!Array.prototype.filter) {
        Array.prototype.filter = function filter(fun /*, thisp */) {
            var self = toObject(this),
                length = self.length >>> 0,
                result = [],
                value,
                thisp = arguments[1],
                i;

            // If no callback function or if callback is not a callable function
            if (typeof fun !== "function") {
                throw new TypeError(fun + " is not a function");
            }

            for (i = 0; i < length; i += 1) {
                if (i in self) {
                    value = self[i];
                    if (fun.call(thisp, value, i, self)) {
                        result.push(value);
                    }
                }
            }
            return result;
        };
    }
}());
