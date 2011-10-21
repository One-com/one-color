/*global one*/
one.include('js:one.js');
one.include('js:String-capitalize.js');

/**
 * @namespace one.color
 */

/**
 * Parse a hex string, 24-bit integer or object representing a color.
 * If a one.color.(RGB|HSL|HSV|CMYK) object is provided, it will be returned
 * as-is, so in library code you can use {@link one.color} to be flexible
 * about how colors are provided to you:
 * <pre><code>
function foo (myColor) {
myColor = color(myColor);
// Now we are sure that myColor is a one.color.(RGB|CMYK|HSL|HSV) object, even if it was provided as a hex string.
}
 * </code></pre>
 * @param {String|Object} obj A hex string, integer value, or
 * object to parse.
 * @return {one.color.RGB|one.color.HSL|one.color.HSV|one.color.CMYK} Color object representing the
 * parsed color, or false if the input couldn't be parsed.
 */
one.color = (function () {
    var channelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,
        alphaChannelRegExp = /\s*(\.\d+|\d+(?:\.\d+)?)\s*/,
        cssColorRegExp = new RegExp("^(rgb|hsl|hsv)a?\\(" +
                             channelRegExp.source + "," +
                             channelRegExp.source + "," +
                             channelRegExp.source +
                             "(?:," + alphaChannelRegExp.source + ")?" +
                             "\\)$", "i");

    return function (obj) {
        if (obj.charCodeAt) {
            // Test for CSS rgb(....) string
            var matchCssSyntax = obj.match(cssColorRegExp);
            if (matchCssSyntax) {
                var colorSpaceName = matchCssSyntax[1].toUpperCase(),
                    alpha = typeof matchCssSyntax[8] === 'undefined' ? matchCssSyntax[8] : parseFloat(matchCssSyntax[8]),
                    hasHue = colorSpaceName[0] === 'H',
                    firstChannelDivisor = matchCssSyntax[3] ? 100 : (hasHue ? 360 : 255),
                    secondChannelDivisor = (matchCssSyntax[5] || hasHue) ? 100 : 255,
                    thirdChannelDivisor = (matchCssSyntax[7] || hasHue) ? 100 : 255;
                if (!(colorSpaceName in one.color)) {
                    throw new Error("one.color." + colorSpaceName + " is not installed.");
                }
                return new one.color[colorSpaceName](
                    parseFloat(matchCssSyntax[2]) / firstChannelDivisor,
                    parseFloat(matchCssSyntax[4]) / secondChannelDivisor,
                    parseFloat(matchCssSyntax[6]) / thirdChannelDivisor,
                    alpha
                );
            }
            // Assume hex syntax
            if (obj.length < 6) {
                // Allow CSS shorthand
                obj = obj.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3');
            }
            // Split obj into red, green, and blue components
            var hexMatch = obj.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);
            if (hexMatch) {
                return new one.color.RGB(
                    parseInt(hexMatch[1], 16) / 255,
                    parseInt(hexMatch[2], 16) / 255,
                    parseInt(hexMatch[3], 16) / 255
                );
            }
        } else if (typeof obj === 'object' && obj.isColor) {
            return obj;
        } else if (Object.prototype.toString.apply(obj) === '[object Array]') {
            return new one.color[obj[0]](obj.slice(1, obj.length));
        } else if (!isNaN(obj)) {
            // Strange integer representation sometimes returned by document.queryCommandValue in some browser...
            return new one.color.RGB((obj & 0xFF) / 255, ((obj & 0xFF00) >> 8) / 255, ((obj & 0xFF0000) >> 16) / 255);
        }
        return false;
    };
}());
/*jslint evil:true*/

one.color.installedColorSpaces = [];

one.color.installColorSpace = function (colorSpaceName, propertyNames, config) {
    one.color[colorSpaceName] = new Function(propertyNames.join(","),
        // Allow passing an array to the constructor:
        "if (Object.prototype.toString.apply(" + propertyNames[0] + ") === '[object Array]') {" +
            propertyNames.map(function (propertyName, i) {
                return propertyName + "=" + propertyNames[0] + "[" + i + "];";
            }).reverse().join("") +
        "}" +
        "if (" + propertyNames.filter(function (propertyName) {
            return propertyName !== 'alpha';
        }).map(function (propertyName) {
            return "isNaN(" + propertyName + ")";
        }).join("||") + "){" + "throw new Error(\"[one.color." + colorSpaceName + "]: Invalid color: (\"+" + propertyNames.join("+\",\"+") + "+\")\");}" +
        propertyNames.map(function (propertyName) {
            if (propertyName === 'hue') {
                return "this._hue=hue<0?hue-Math.floor(hue):hue%1"; // Wrap
            } else if (propertyName === 'alpha') {
                return "this._alpha=(isNaN(alpha)||alpha>1)?1:(alpha<0?0:alpha);";
            } else {
                return "this._" + propertyName + "=" + propertyName + "<0?0:(" + propertyName + ">1?1:" + propertyName + ")";
            }
        }).join(";") + ";"
    );
    one.color[colorSpaceName].propertyNames = propertyNames;

    var prototype = one.color[colorSpaceName].prototype;

    ['valueOf', 'hex', 'css', 'cssa'].forEach(function (methodName) {
        prototype[methodName] = prototype[methodName] || (colorSpaceName === 'RGB' ? prototype.hex : new Function("return this.rgb()." + methodName + "();"));
    });

    prototype.isColor = true;

    prototype.equals = function (otherColor, epsilon) {
        if (typeof epsilon === 'undefined') {
            epsilon = 1e-10;
        }

        otherColor = otherColor[colorSpaceName.toLowerCase()]();

        for (var i = 0; i < propertyNames.length; i = i + 1) {
            if (Math.abs(this['_' + propertyNames[i]] - otherColor[propertyNames[i]]) > epsilon) {
                return false;
            }
        }

        return true;
    };

    prototype.toJSON = new Function(
        "return ['" + colorSpaceName + "', " +
            propertyNames.map(function (propertyName) {
                return "this._" + propertyName;
            }, this).join(", ") +
        "];"
    );

    for (var propertyName in config) {
        if (config.hasOwnProperty(propertyName)) {
            var matchFromColorSpace = propertyName.match(/^from(.*)$/);
            if (matchFromColorSpace) {
                one.color[matchFromColorSpace[1].toUpperCase()].prototype[colorSpaceName.toLowerCase()] = config[propertyName];
            } else {
                prototype[propertyName] = config[propertyName];
            }
        }
    }

    // It is pretty easy to implement the conversion to the same color space:
    prototype[colorSpaceName.toLowerCase()] = function () {
        return this;
    };
    prototype.toString = new Function("return \"[one.color." + colorSpaceName + ":\"+" + propertyNames.map(function (propertyName, i) {
        return "\" " + propertyNames[i] + "=\"+this._" + propertyName;
    }).join("+") + "+\"]\";");

    // Generate getters and setters
    propertyNames.forEach(function (propertyName, i) {
        prototype[propertyName] = new Function("value", "isDelta",
            // Simple getter mode: color.red()
            "if (typeof value === 'undefined') {" +
                "return this._" + propertyName + ";" +
            "}" +
            // Adjuster: color.red(+.2, true)
            "if (isDelta) {" +
                "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                    return "this._" + otherPropertyName + (propertyName === otherPropertyName ? "+value" : "");
                }).join(", ") + ");" +
            "}" +
            // Setter: color.red(.2);
            "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
                return propertyName === otherPropertyName ? "value" : "this._" + otherPropertyName;
            }).join(", ") + ");");
    });

    function installForeignMethods(targetColorSpaceName, sourceColorSpaceName) {
        var obj = {};
        obj[sourceColorSpaceName.toLowerCase()] = new Function("return this.rgb()." + sourceColorSpaceName.toLowerCase() + "();"); // Fallback
        one.color[sourceColorSpaceName].propertyNames.forEach(function (propertyName, i) {
            obj[propertyName] = new Function ("value", "isDelta", "return this." + sourceColorSpaceName.toLowerCase() + "()." + propertyName + "(value, isDelta);");
        });
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && one.color[targetColorSpaceName].prototype[prop] === undefined) {
                one.color[targetColorSpaceName].prototype[prop] = obj[prop];
            }
        }
    }

    one.color.installedColorSpaces.forEach(function (otherColorSpaceName) {
        installForeignMethods(colorSpaceName, otherColorSpaceName);
        installForeignMethods(otherColorSpaceName, colorSpaceName);
    });

    one.color.installedColorSpaces.push(colorSpaceName);
};

/**
 * @name one.color.RGB
 * @class
 * <p>A color in the RGB colorspace with an optional alpha value.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects are designed to be
 * immutable; all the conversion, set, and adjust methods return new
 * objects.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects automatically get the set
 * and adjust methods from all other installed colorspaces, so
 * although you can use the explicit conversion methods ({@link
 * one.color.RGB#hsl}, {@link one.color.RGB#cmyk}...), the below
 * will work just fine:</p><pre><code>
one.include('jslib:one/color.js');
one.include('jslib:one/color/HSL.js');

new one.color.RGB(.4, .3, .9).
    lightness(+.2, true). // Implicit conversion to HSL
    red(-.1). // Implicit conversion back to RGB
    hex(); // "#00a6f2"
</code></pre>
 *
 * @constructor
 * Create a new one.color.RGB object. Values outside the supported
 * range, [0..1], will be adjusted automatically.
 * @param {Number} red The red component, range: [0..1]
 * @param {Number} green The green component, range: [0..1]
 * @param {Number} blue The blue component, range: [0..1]
 * @param {Number} [alpha] The alpha value, range: [0..1],
 * defaults to 1
 */

one.color.installColorSpace('RGB', ['red', 'green', 'blue', 'alpha'], {
    /**
     * Get the standard RGB hex representation of the color.
     * @return {String} The hex string, e.g. "#f681df"
     */
    hex: function () {
        var hexString = (Math.round(255 * this._red) * 0x10000 + Math.round(255 * this._green) * 0x100 + Math.round(255 * this._blue)).toString(16);
        return '#' + ('00000'.substr(0, 6 - hexString.length)) + hexString;
    },

    /**
     * Get a valid CSS color representation of the color without an
     * alpha value.
     * @return {String} The CSS color string, e.g. "rgb(123, 2, 202)"
     */
    css: function () {
        return "rgb(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + ")";
    },

    /**
     * Get a valid CSS color representation of the color, including
     * the alpha value.
     * @return {String} The CSS color string, e.g. "rgba(123, 2, 202, 0.253)"
     */
    cssa: function () {
        return "rgba(" + Math.round(255 * this._red) + "," + Math.round(255 * this._green) + "," + Math.round(255 * this._blue) + "," + this._alpha + ")";
    }
});

/**
 * @name one.color.RGB.prototype.red
 * @function
 * @param {Number} red The new red component, range: [0..1]. If not
 * provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.RGB} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.green
 * @function
 * @param {Number} green The new green component, range: [0..1]
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.RGB} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.blue
 * @function
 * @param {Number} blue The new blue component, range: [0..1]
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.RGB} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.alpha
 * @function
 * @param {Number} alpha The new alpha value, range: [0..1]
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.RGB} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.toJSON
 * @description Convert the color to a JSON representation.
 * @function
 * @return {Array}
 */

/**
 * @name one.color.RGB.prototype.rgb
 * @description Convert the color to a {@link one.color.RGB} object, ie. return the
 * object itself.
 * @function
 * @return {one.color.RGB}
 */

/**
 * @name one.color.RGB.prototype.hsv
 * @description Convert the color to a {@link one.color.HSV} object.
 * @function
 * @requires one.color.HSV
 * @return {one.color.HSV}
 */

/**
 * @name one.color.RGB.prototype.hsl
 * @description Convert the color to a {@link one.color.HSL} object.
 * @function
 * @requires one.color.HSL
 * @return {one.color.HSL}
 */

/**
 * @name one.color.RGB.prototype.cmyk
 * @description Convert the color to a {@link one.color.CMYK} object.
 * @function
 * @requires one.color.CMYK
 * @return {one.color.CMYK}
 */
