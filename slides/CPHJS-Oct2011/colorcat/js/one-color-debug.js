/*global window*/

/**
 * @namespace one One.com global JavaScript namespace.
 * @exports window.one as one
 */
if (typeof window !== 'undefined') {
	window.one = window.one || {};
} else {
	var one = {};
}

one.include = one.exclude = function () {}; // Ignore these in development mode

/*global one*/

/**
 * @namespace one.color
 */
one.color = one.color || {};

(function () {
    /** @exports stringPrototype as String.prototype*/
    var stringPrototype = String.prototype;

    /**
     * <p>Returns this string with the char at first position in uppercase.</p>
     * <p>Example of use:</p><pre><code>
    "the brown Fox jumped over the lazy Dog".capitalize(); // = "The brown Fox jumped over the lazy Dog"
    </code></pre>
     * @return capitalized string.
     * @memberOf String.prototype
     */
    stringPrototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.substring(1);
    };
}());

/*global one*/

/*jslint evil:true*/

one.color.installedColorSpaces = [];

one.color.installColorSpace = function (colorSpaceName, propertyDefinitions, config) {
    var propertyNames = propertyDefinitions.map(function (propertyDefinition) {
            return propertyDefinition.match(/[A-Z]/)[0].toLowerCase();
        }),
        longPropertyNames = propertyDefinitions.map(function (propertyDefinition) {
            return propertyDefinition.toLowerCase().capitalize();
        }),
        Constructor = one.color[colorSpaceName] = new Function(propertyNames.join(","),
            // Allow passing an array to the constructor:
            "if (Object.prototype.toString.apply(" + propertyNames[0] + ") === '[object Array]') {" +
                propertyNames.map(function (propertyName, i) {
                    return propertyName + "=" + propertyNames[0] + "[" + i + "];";
                }).reverse().join("") +
            "}" +
            "if (" + propertyNames.filter(function (propertyName) {
                return propertyName !== 'a';
            }).map(function (propertyName) {
                return "isNaN(" + propertyName + ")";
            }).join("||") + "){" + "throw \"[one.color." + colorSpaceName + "]: Invalid color: (\"+" + propertyNames.join("+\",\"+") + "+\")\";}" +
            propertyNames.map(function (propertyName) {
                if (propertyName === 'h') {
                    return "this.h=h<0?h-Math.floor(h):h%1"; // Wrap
                } else if (propertyName === 'a') {
                    return "this.a=(isNaN(a)||a>1)?1:(a<0?0:a);";
                } else {
                    return "this." + propertyName + "=" + propertyName + "<0?0:(" + propertyName + ">1?1:" + propertyName + ")";
                }
            }).join(";") + ";"
        ),
        prototype = Constructor.prototype;

    Constructor.propertyNames = propertyNames;
    Constructor.longPropertyNames = longPropertyNames;

    ['valueOf', 'toHex', 'toCSS', 'toCSSWithAlpha'].forEach(function (methodName) {
        prototype[methodName] = prototype[methodName] || (colorSpaceName === 'RGB' ? prototype.toHex : new Function("return this.toRGB()." + methodName + "();"));
    });

    prototype.isColor = true;

    prototype.equals = function (otherColor, epsilon) {
        if (typeof epsilon === 'undefined') {
            epsilon = 1e-10;
        }

        otherColor = otherColor['to' + colorSpaceName]();

        for (var i = 0; i < propertyNames.length; i = i + 1) {
            if (Math.abs(this[propertyNames[i]] - otherColor[propertyNames[i]]) > epsilon) {
                return false;
            }
        }

        return true;
    };

    prototype.toJSON = new Function(
        "return ['" + colorSpaceName + "', " +
            propertyNames.map(function (propertyName) {
                return "this." + propertyName;
            }, this).join(", ") +
        "];"
    );

    if (config.fromRGB) {
        one.color.RGB.prototype['to' + colorSpaceName] = config.fromRGB;
        delete config.fromRGB;
    }
    for (var prop in config) {
        if (config.hasOwnProperty(prop)) {
            prototype[prop] = config[prop];
        }
    }

    // It is pretty easy to implement the conversion to the same color space:
    prototype['to' + colorSpaceName] = function () {
        return this;
    };
    prototype.toString = new Function("return \"[one.color." + colorSpaceName + ":\"+" + propertyNames.map(function (propertyName, i) {
        return "\" " + longPropertyNames[i] + "=\"+this." + propertyName;
    }).join("+") + "+\"]\";");

    // Generate getters and setters
    propertyNames.forEach(function (propertyName, i) {
        var longPropertyName = longPropertyNames[i];
        prototype['get' + longPropertyName] = new Function("return this." + propertyName + ";");
        prototype['set' + longPropertyName] = new Function("newValue", "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
            return propertyName === otherPropertyName ? "newValue" : "this." + otherPropertyName;
        }).join(", ") + ");");
        prototype['adjust' + longPropertyName] = new Function("delta", "return new this.constructor(" + propertyNames.map(function (otherPropertyName, i) {
            return "this." + otherPropertyName + (propertyName === otherPropertyName ? "+delta" : "");
        }).join(", ") + ");");
    });

    function installForeignMethods(targetColorSpaceName, sourceColorSpaceName) {
        var obj = {};
        obj['to' + sourceColorSpaceName] = new Function("return this.toRGB().to" + sourceColorSpaceName + "();"); // Fallback
        one.color[sourceColorSpaceName].propertyNames.forEach(function (property, i) {
            var longPropertyName = one.color[sourceColorSpaceName].longPropertyNames[i];
            obj['get' + longPropertyName] = new Function("return this.to" + sourceColorSpaceName + "().get" + longPropertyName + "();");
            obj['set' + longPropertyName] = new Function("newValue", "return this.to" + sourceColorSpaceName + "().set" + longPropertyName + "(newValue);");
            obj['adjust' + longPropertyName] = new Function("delta", "return this.to" + sourceColorSpaceName + "().adjust" + longPropertyName + "(delta);");
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

/*global one*/


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
 * one.color.RGB#toHSL}, {@link one.color.RGB#toCMYK}...), the below
 * will work just fine:</p><pre><code>

new one.color.RGB(.4, .3, .9).
    adjustLightness(+.2). // Implicit conversion to HSL
    setRed(-.1). // Implicit conversion back to RGB
    toHex(); // "#00a6f2"
</code></pre>
 *
 * @constructor
 * Create a new one.color.RGB object. Values outside the supported
 * range, [0..1], will be adjusted automatically.
 * @param {Number} r The red component, range: [0..1]
 * @param {Number} g The green component, range: [0..1]
 * @param {Number} b The blue component, range: [0..1]
 * @param {Number} [a] The alpha value, range: [0..1],
 * defaults to 1
 */

one.color.installColorSpace('RGB', ['Red', 'Green', 'Blue', 'Alpha'], {
    /**
     * Get the standard RGB hex representation of the color.
     * @return {String} The hex string, e.g. "#f681df"
     */
    toHex: function () {
        var hexString = (Math.round(255 * this.r) * 0x10000 + Math.round(255 * this.g) * 0x100 + Math.round(255 * this.b)).toString(16);
        return '#' + ('00000'.substr(0, 6 - hexString.length)) + hexString;
    },

    /**
     * Get a valid CSS color representation of the color without an
     * alpha value.
     * @return {String} The CSS color string, e.g. "rgb(123, 2, 202)"
     */
    toCSS: function () {
        return "rgb(" + Math.round(255 * this.r) + "," + Math.round(255 * this.g) + "," + Math.round(255 * this.b) + ")";
    },

    /**
     * Get a valid CSS color representation of the color, including
     * the alpha value.
     * @return {String} The CSS color string, e.g. "rgba(123, 2, 202, 0.253)"
     */
    toCSSWithAlpha: function () {
        return "rgba(" + Math.round(255 * this.r) + "," + Math.round(255 * this.g) + "," + Math.round(255 * this.b) + "," + this.a + ")";
    }
});

/**
 * @name one.color.RGB.prototype.r
 * @property
 * @type Number
 * @description The red component, range: [0..1]
 */

/**
 * @name one.color.RGB.prototype.g
 * @property
 * @type Number
 * @description The green component, range: [0..1]
 */

/**
 * @name one.color.RGB.prototype.b
 * @property
 * @type Number
 * @description The blue component, range: [0..1]
 */

/**
 * @name one.color.RGB.prototype.a
 * @property
 * @type Number
 * @description The alpha value, range: [0..1]
 */

/**
 * @name one.color.RGB.prototype.setRed
 * @function
 * @param {Number} r The new red component, range: [0..1]
 * @return {one.color.RGB} New color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.setGreen
 * @function
 * @param {Number} g The new green component, range: [0..1]
 * @return {one.color.RGB} New color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.setBlue
 * @function
 * @param {Number} b The new blue component, range: [0..1]
 * @return {one.color.RGB} New color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.setAlpha
 * @function
 * @param {Number} a The new alpha value, range: [0..1]
 * @return {one.color.RGB} New color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.adjustRed
 * @function
 * @param {Number} r The value to add to the red component. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.RGB} New color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.adjustGreen
 * @function
 * @param {Number} g The value to add to the green component. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.RGB} New color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.adjustBlue
 * @function
 * @param {Number} b The value to add to the blue component. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.RGB} New color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.adjustAlpha
 * @function
 * @param {Number} a The value to add to the alpha value. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.RGB} New color object with the changed value.
 */

/**
 * @name one.color.RGB.prototype.toJSON
 * @description Convert the color to a JSON representation.
 * @function
 * @return {Array}
 */

/**
 * @name one.color.RGB.prototype.toRGB
 * @description Convert the color to a {@link one.color.RGB} object, ie. return the
 * object itself.
 * @function
 * @return {one.color.RGB}
 */

/**
 * @name one.color.RGB.prototype.toHSV
 * @description Convert the color to a {@link one.color.HSV} object.
 * @function
 * @requires one.color.HSV
 * @return {one.color.HSV}
 */

/**
 * @name one.color.RGB.prototype.toHSL
 * @description Convert the color to a {@link one.color.HSL} object.
 * @function
 * @requires one.color.HSL
 * @return {one.color.HSL}
 */

/**
 * @name one.color.RGB.prototype.toCMYK
 * @description Convert the color to a {@link one.color.CMYK} object.
 * @function
 * @requires one.color.CMYK
 * @return {one.color.CMYK}
 */

/*jslint bitwise:false*/
/*global one*/

/**
 * Parse a hex string. Please use {@link one.color#parse} instead.
 * @param strHex The hex string, e.g. <tt>"#abc"</tt>,
 * <tt>"123abc"<tt>....
 * @return {one.color.RGB} Color object representing the parsed
 * color, or false if the string couldn't be parsed.
 * @private
 */
one.color.fromHex = function (strHex) {
    if (strHex.length < 6) {
        // Allow CSS shorthand
        strHex = strHex.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3');
    }
    // Split strHex into red, green, and blue components
    var hexMatch = strHex.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);
    if (hexMatch) {
        return new one.color.RGB(
            parseInt(hexMatch[1], 16) / 255,
            parseInt(hexMatch[2], 16) / 255,
            parseInt(hexMatch[3], 16) / 255
        );
    }
};

/**
 * Regex for matching CSS RGBA color strings
 * @private
 */
one.color.rgbaRegex =/^rgba?\(\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*,\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*,\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*(?:,\s*(\.\d+|\d+(?:\.\d+))\s*)?\)/i;

/**
 * Parse a CSS RGBA string. Please use {@link one.color#parse} instead.
 * @param strCSS The CSS RGBA string, e.g. <tt>"rgb(100, 255, 100)"</tt>,
 * <tt>"rgba(0, 0, 255, 0.5)"<tt>, <tt>"rgb(0%, 100%, 0%)"</tt>....
 * @return {one.color.RGB} Color object representing the parsed
 * color, or false if the string couldn't be parsed.
 * @private
 */
one.color.fromCSSRGBA = function (strCSS) {
    var match = strCSS.match(one.color.rgbaRegex);

    if (match) {
        return new one.color.RGB(
            parseFloat(match[1]) / (match[2] ? 100 : 255),
            parseFloat(match[3]) / (match[4] ? 100 : 255),
            parseFloat(match[5]) / (match[6] ? 100 : 255),
            parseFloat(match[7])
        );
    }
};

/**
 * Parse a hex string, 24-bit integer or object representing a color.
 * If a one.color.(RGB|HSL|HSV|CMYK) object is provided, it will be returned
 * as-is, so in library code you can use {@link one.color.parse} to be flexible
 * about how colors are provided to you:
 * <pre><code>
function foo (color) {
color = color.parse(color);
// Now we are sure that color is a one.color.(RGB|CMYK|HSL|HSV) object, even if it was provided as a hex string.
}
 * </code></pre>
 * @param {String|Object} obj A hex string, integer value, or
 * object to parse.
 * @return {one.color.RGB|one.color.HSL|one.color.HSV|one.color.CMYK} Color object representing the
 * parsed color, or false if the input couldn't be parsed.
 */
one.color.parse = function (obj) {
    if (obj.charCodeAt) {
        return one.color.fromCSSRGBA(obj) || one.color.fromHex(obj);
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

/*global one*/


/**
 * @name one.color.HSV
 * @class
 * <p>A color in the HSV colorspace, with an optional alpha value.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects are designed to be
 * immutable; all the conversion, set, and adjust methods return new
 * objects.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects automatically get the set
 * and adjust methods from all other installed colorspaces, so
 * although you can use the explicit conversion methods ({@link
 * one.color.HSV#toRGB}, {@link one.color.HSV#toHSL}...), the below
 * will work just fine:</p><pre><code>

new one.color.HSV(.9, .2, .4).
    adjustBlue(-.4). // Implicit conversion to RGB
    setCyan(-.1). // Implicit conversion to CMYK
    toHex(); // "#665200"
</code></pre>
 *
 * @constructor
 * Create a new one.color.HSV object. Component values outside the
 * supported range, [0..1], will be adjusted automatically.
 * @param {Number} h The hue component, range: [0..1]
 * @param {Number} s The saturation component, range: [0..1]
 * @param {Number} v The value component, range: [0..1]
 * @param {Number} [a] The alpha value, range: [0..1],
 * defaults to 1
 */

/**
 * @name one.color.HSV.prototype.h
 * @property
 * @type Number
 * @description The hue component, range: [0..1]
 */

/**
 * @name one.color.HSV.prototype.s
 * @property
 * @type Number
 * @description The saturation component, range: [0..1]
 */

/**
 * @name one.color.HSV.prototype.v
 * @property
 * @type Number
 * @description The value component, range: [0..1]
 */

/**
 * @name one.color.HSV.prototype.a
 * @property
 * @type Number
 * @description The alpha value, range: [0..1]
 */

/**
 * @name one.color.HSV.prototype.setHue
 * @function
 * @param {Number} h The new hue component, range: [0..1]
 * @return {one.color.HSV} New color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.setSaturation
 * @function
 * @param {Number} s The new saturation component, range: [0..1]
 * @return {one.color.HSV} New color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.setValue
 * @function
 * @param {Number} l The new value component, range: [0..1]
 * @return {one.color.HSV} New color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.setAlpha
 * @function
 * @param {Number} a The new alpha value, range: [0..1]
 * @return {one.color.HSV} New color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.adjustHue
 * @function
 * @param {Number} h The value to add to the hue component. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.HSV} New color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.adjustSaturation
 * @function
 * @param {Number} s The value to add to the saturation component. If the
 * resulting value falls outside the supported range, [0..1], it will
 * be adjusted automatically.
 * @return {one.color.HSV} New color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.adjustValue
 * @function
 * @param {Number} v The value to add to the value component. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.HSV} New color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.adjustAlpha
 * @function
 * @param {Number} a The value to add to the alpha value. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.HSV} New color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.toJSON
 * @description Convert the color to a JSON representation.
 * @function
 * @return {Array}
 */

/**
 * @name one.color.HSV.prototype.toRGB
 * @description Convert the color to a {@link one.color.RGB} object.
 * @function
 * @return {one.color.RGB}
 */

/**
 * @name one.color.HSV.prototype.toHSV
 * @description Convert the color to a {@link one.color.HSV} object, ie. return the object itself.
 * @function
 * @return {one.color.HSV}
 */

/**
 * @name one.color.HSV.prototype.toHSL
 * @description Convert the color to a {@link one.color.HSL} object.
 * @function
 * @requires one.color.HSL
 * @return {one.color.HSL}
 */

/**
 * @name one.color.HSV.prototype.toCMYK
 * @description Convert the color to a {@link one.color.CMYK} object.
 * @function
 * @include one.color.CMYK
 * @return {one.color.CMYK}
 */

/**
 * @name one.color.HSV.prototype.toHex
 * @description Get the standard RGB hex representation of the color.
 * @function
 * @return {String} The hex string, e.g. "#f681df"
 */

/**
 * @name one.color.HSV.prototype.toCSS
 * @description Get a valid CSS color representation of the color without an alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgb(123, 2, 202)"
 */

/**
 * @name one.color.HSV.prototype.toCSSWithAlpha
 * @description Get a valid CSS color representation of the color, including the alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgba(123, 2, 202, 0.253)"
 */
one.color.installColorSpace('HSV', ['Hue', 'Saturation', 'Value', 'Alpha'], {
    toRGB: function () {
        var r, g, b,
            i = Math.min(5, Math.floor(this.h * 6)),
            f = this.h * 6 - i,
            p = this.v * (1 - this.s),
            q = this.v * (1 - f * this.s),
            t = this.v * (1 - (1 - f) * this.s);
        switch (i) {
        case 0:
            r = this.v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = this.v;
            b = p;
            break;
        case 2:
            r = p;
            g = this.v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = this.v;
            break;
        case 4:
            r = t;
            g = p;
            b = this.v;
            break;
        case 5:
            r = this.v;
            g = p;
            b = q;
            break;
        }
        return new one.color.RGB(r, g, b, this.a);
    },

    toHSL: function () {
        // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
        var s = this.s * this.v,
            l = (2 - this.s) * this.v;
        return new one.color.HSL(this.h, s / (l <= 1 ? l : (2 - l)), l / 2, this.a);
    },

    fromRGB: function () { // Becomes one.color.RGB.prototype.toHSV
        var max = Math.max(this.r, this.g, this.b),
            min = Math.min(this.r, this.g, this.b),
            delta = max - min,
            h,
            s = (max === 0) ? 0 : (delta / max),
            v = max;
        if (delta === 0) {
            h = 0;
        } else {
            switch (max) {
            case this.r:
                h = (this.g - this.b) / delta / 6 + (this.g < this.b ? 1 : 0);
                break;
            case this.g:
                h = (this.b - this.r) / delta / 6 + 1 / 3;
                break;
            case this.b:
                h = (this.r - this.g) / delta / 6 + 2 / 3;
                break;
            }
        }
        return new one.color.HSV(h, s, v, this.a);
    }
});

/*global one*/


/**
 * @name one.color.HSL
 * @class
 * <p>A color in the HSL colorspace, with an optional alpha value.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects are designed to be
 * immutable; all the conversion, set, and adjust methods return new
 * objects.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects automatically get the set
 * and adjust methods from all other installed colorspaces, so
 * although you can use the explicit conversion methods ({@link
 * one.color.HSL#toRGB}, {@link one.color.HSL#toHSV}...), the below
 * will work just fine:</p><pre><code>

new one.color.HSL(.4, .3, .9, .9). // HSL with alpha
    adjustBlack(+.1). // Implicit conversion to CMYK (with alpha)
    setGreen(-.1). // Implicit conversion to RGB (with alpha)
    toCSSWithAlpha(); // "rgba(198,0,203,0.9)"
</code></pre>
 *
 * @constructor
 * Create a new one.color.HSL object. Component values outside the
 * supported range, [0..1], will be adjusted automatically.
 * @param {Number} h The hue component, range: [0..1]
 * @param {Number} s The saturation component, range: [0..1]
 * @param {Number} l The lightness component, range: [0..1]
 * @param {Number} [a] The alpha value, range: [0..1],
 * defaults to 1
 */

one.color.installColorSpace('HSL', ['Hue', 'Saturation', 'Lightness', 'Alpha'], {
    toHSV: function () {
        // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
        var s = this.s,
            l = this.l * 2;
        if (l <= 1) {
            s *= l;
        } else {
            s *= (2 - l);
        }
        return new one.color.HSV(this.h, (2 * s) / (l + s), (l + s) / 2, this.a);
    },

    toRGB: function () {
        return this.toHSV().toRGB();
    },

    fromRGB: function () { // Becomes one.color.RGB.prototype.toHSV
        return this.toHSV().toHSL();
    }
});

/**
 * @name one.color.HSL.prototype.h
 * @property
 * @type Number
 * @description The hue component, range: [0..1]
 */

/**
 * @name one.color.HSL.prototype.s
 * @property
 * @type Number
 * @description The saturation component, range: [0..1]
 */

/**
 * @name one.color.HSL.prototype.l
 * @property
 * @type Number
 * @description The lightness component, range: [0..1]
 */

/**
 * @name one.color.HSL.prototype.a
 * @property
 * @type Number
 * @description The alpha value, range: [0..1]
 */

/**
 * @name one.color.HSL.prototype.setHue
 * @function
 * @param {Number} h The new hue component, range: [0..1]
 * @return {one.color.HSL} New color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.setSaturation
 * @function
 * @param {Number} s The new saturation component, range: [0..1]
 * @return {one.color.HSL} New color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype
 * @function setLightness
 * @param {Number} l The new lightness component, range: [0..1]
 * @return {one.color.HSL} New color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.setAlpha
 * @function
 * @param {Number} a The new alpha value, range: [0..1]
 * @return {one.color.HSL} New color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.adjustHue
 * @function
 * @param {Number} h The value to add to the hue component. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.HSL} New color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.adjustSaturation
 * @function
 * @param {Number} s The value to add to the saturation component. If the
 * resulting value falls outside the supported range, [0..1], it will
 * be adjusted automatically.
 * @return {one.color.HSL} New color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.adjustLightness
 * @function
 * @param {Number} l The value to add to the lightness component. If the
 * resulting value falls outside the supported range, [0..1], it will
 * be adjusted automatically.
 * @return {one.color.HSL} New color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.adjustAlpha
 * @function
 * @param {Number} a The value to add to the alpha value. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.HSL} New color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.toJSON
 * @description Convert the color to a JSON representation.
 * @function
 * @return {Array}
 */

/**
 * @name one.color.HSL.prototype.toRGB
 * @description Convert the color to a {@link one.color.RGB} object.
 * @function
 * @return {one.color.RGB}
 */

/**
 * @name one.color.HSL.prototype.toHSV
 * @description Convert the color to a {@link one.color.HSV} object.
 * @function
 * @return {one.color.HSV}
 * @requires one.color.HSV
 */

/**
 * @name one.color.HSL.prototype.toHSL
 * @description Convert the color to a {@link one.color.HSL} object, ie. return the object itself.
 * @function
 * @return {one.color.HSL}
 */

/**
 * @name one.color.HSL.prototype.toCMYK
 * @description Convert the color to a {@link one.color.CMYK} object.
 * @function
 * @requires one.color.CMYK
 * @return {one.color.CMYK}
 */

/**
 * @name one.color.HSL.prototype.toHex
 * @description Get the standard RGB hex representation of the color.
 * @function
 * @return {String} The hex string, e.g. "#f681df"
 */

/**
 * @name one.color.HSL.prototype.toCSS
 * @description Get a valid CSS color representation of the color without an alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgb(123, 2, 202)"
 */

/**
 * @name one.color.HSL.prototype.toCSSWithAlpha
 * @description Get a valid CSS color representation of the color, including the alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgba(123, 2, 202, 0.253)"
 */

/*global one*/

/**
 * @name one.color.CMYK
 * @class
 * <p>A color in the CMYK colorspace, with an optional alpha value.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects are designed to be
 * immutable; all the conversion, set, and adjust methods return new
 * objects.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects automatically get the set
 * and adjust methods from all other installed colorspaces, so
 * although you can use the explicit conversion methods ({@link one.color.CMYK#toRGB},
 * {@link one.color.CMYK#toHSL}...), the below
 * will work just fine:</p><pre><code>

new one.color.CMYK(.4, .2, .4, .9, .2). // CMYK with alpha
    setBlue(-.2). // Implicit conversion to RGB (with alpha)
    adjustHue(-.1). // Implicit conversion to HSL(/HSV) (with alpha)
    toCSSWithAlpha(); // "rgba(20,13,0,0.2)"
</code></pre>
 * @static
 *
 * @constructor
 * Create a new one.color.CMYK object. Component values outside the
 * supported range, [0..1], will be adjusted automatically.
 * @param {Number} c The cyan component, range: [0..1]
 * @param {Number} m The magenta component, range: [0..1]
 * @param {Number} y The yellow component, range: [0..1]
 * @param {Number} k The black component, range: [0..1]
 * @param {Number} [a] The alpha value, range: [0..1],
 * defaults to 1
 */

/**
 * @name one.color.CMYK.prototype.c
 * @property
 * @type Number
 * @description The cyan component, range: [0..1]
 */

/**
 * @name one.color.CMYK.prototype.m
 * @property
 * @type Number
 * @description The magenta component, range: [0..1]
 */

/**
 * @name one.color.CMYK.prototype.y
 * @property
 * @type Number
 * @description The yellow component, range: [0..1]
 */

/**
 * @name one.color.CMYK.prototype.k
 * @property
 * @type Number
 * @description The black component, range: [0..1]
 */

/**
 * @name one.color.CMYK.prototype.a
 * @property
 * @type Number
 * @description The alpha value, range: [0..1]
 */

/**
 * @name one.color.CMYK.prototype.setCyan
 * @function
 * @param {Number} c The new cyan component, range: [0..1]
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.setMagenta
 * @function
 * @param {Number} m The new magenta component, range: [0..1]
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.setYellow
 * @function
 * @param {Number} y The new yellow component, range: [0..1]
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.setBlack
 * @function
 * @param {Number} k The new black component, range: [0..1]
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.setAlpha
 * @function
 * @param {Number} a The new alpha value, range: [0..1]
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.adjustCyan
 * @function
 * @param {Number} c The value to add to the cyan component. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.adjustMagenta
 * @function
 * @param {Number} m The value to add to the magenta component. If the
 * resulting value falls outside the supported range, [0..1], it will
 * be adjusted automatically.
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.adjustYellow
 * @function
 * @param {Number} y The value to add to the yellow component. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.adjustBlack
 * @function
 * @param {Number} k The value to add to the black component. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.adjustAlpha
 * @function
 * @param {Number} a The value to add to the alpha value. If the resulting
 * value falls outside the supported range, [0..1], it will be
 * adjusted automatically.
 * @return {one.color.CMYK} New color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.toJSON
 * @description Convert the color to a JSON representation.
 * @function
 * @return {Array}
 */

/**
 * @name one.color.CMYK.prototype.toRGB
 * @description Convert the color to a {@link one.color.RGB} object.
 * @function
 * @return {one.color.RGB}
 */

/**
 * @name one.color.CMYK.prototype.toHSV
 * @description Convert the color to a {@link one.color.HSV} object.
 * @function
 * @requires one.color.HSV
 * @return {one.color.HSV}
 */

/**
 * @name one.color.CMYK.prototype.toHSL
 * @description Convert the color to a {@link one.color.HSL} object.
 * @function
 * @requires one.color.HSL
 * @return {one.color.HSL}
 */

/**
 * @name one.color.CMYK.prototype.toCMYK
 * @description Convert the color to a {@link one.color.CMYK} object, ie. return the object itself.
 * @function
 * @return {one.color.CMYK}
 */

/**
 * @name one.color.CMYK.prototype.toHex
 * @description Get the standard RGB hex representation of the color.
 * @function
 * @return {String} The hex string, e.g. "#f681df"
 */

/**
 * @name one.color.CMYK.prototype.toCSS
 * @description Get a valid CSS color representation of the color without an alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgb(123, 2, 202)"
 */

/**
 * @name one.color.CMYK.prototype.toCSSWithAlpha
 * @description Get a valid CSS color representation of the color, including the alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgba(123, 2, 202, 0.253)"
 */

one.color.installColorSpace('CMYK', ['Cyan', 'Magenta', 'Yellow', 'blacK', 'Alpha'], {
    toRGB: function () {
        return new one.color.RGB((1 - this.c * (1 - this.k) - this.k),
                                 (1 - this.m * (1 - this.k) - this.k),
                                 (1 - this.y * (1 - this.k) - this.k),
                                 this.a);
    },

    fromRGB: function () { // Becomes one.color.RGB.prototype.toCMYK
        // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
        var c = 1 - this.r,
            m = 1 - this.g,
            y = 1 - this.b,
            k = 1;
        if (this.r || this.g || this.b) {
            k = Math.min(c, Math.min(m, y));
            c = (c - k) / (1 - k);
            m = (m - k) / (1 - k);
            y = (y - k) / (1 - k);
        } else {
            k = 1;
        }
        return new one.color.CMYK(c, m, y, k, this.a);
    }
});

// This file is purely for the build system
try {
    if (module) {
    	module.exports = one.color;
    }
} catch(e) {}
