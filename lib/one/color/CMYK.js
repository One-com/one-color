/*global one*/
one.include('lib:one/color.js');

/**
 * @name one.color.CMYK
 * @class
 * <p>A color in the CMYK colorspace, with an optional alpha value.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects are designed to be
 * immutable; all the conversion, set, and adjust methods return new
 * objects.</p>
 * <p>one.color.(RGB|HSL|HSV|CMYK) objects automatically get the set
 * and adjust methods from all other installed colorspaces, so
 * although you can use the explicit conversion methods ({@link one.color.CMYK#rgb},
 * {@link one.color.CMYK#hsl}...), the below
 * will work just fine:</p><pre><code>
one.include('jslib:one/color/CMYK.js');
one.include('jslib:one/color/HSL.js');

new one.color.CMYK(.4, .2, .4, .9, .2). // CMYK with alpha
    blue(.2). // Implicit conversion to RGB (with alpha)
    hue(-.1, true). // Implicit conversion to HSL(/HSV) (with alpha)
    cssa(); // "rgba(20,13,0,0.2)"
</code></pre>
 * @static
 *
 * @constructor
 * Create a new one.color.CMYK object. Component values outside the
 * supported range, [0..1], will be adjusted automatically.
 * @param {Number} cyan The cyan component, range: [0..1]
 * @param {Number} magenta The magenta component, range: [0..1]
 * @param {Number} yellow The yellow component, range: [0..1]
 * @param {Number} black The black component, range: [0..1]
 * @param {Number} [alpha] The alpha value, range: [0..1],
 * defaults to 1
 */

/**
 * @name one.color.CMYK.prototype.cyan
 * @function
 * @param {Number} [cyan] The new cyan component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.CMYK} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.magenta
 * @function
 * @param {Number} [magenta] The new magenta component, range:
 * [0..1]. If not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.CMYK} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.yellow
 * @function
 * @param {Number} yellow The new yellow component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.CMYK} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.black
 * @function
 * @param {Number} black The new black component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.CMYK} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.alpha
 * @function
 * @param {Number} alpha The new alpha value, range: [0..1]. If not
 * provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.CMYK} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.CMYK.prototype.toJSON
 * @description Convert the color to a JSON representation.
 * @function
 * @return {Array}
 */

/**
 * @name one.color.CMYK.prototype.rgb
 * @description Convert the color to a {@link one.color.RGB} object.
 * @function
 * @return {one.color.RGB}
 */

/**
 * @name one.color.CMYK.prototype.hsv
 * @description Convert the color to a {@link one.color.HSV} object.
 * @function
 * @requires one.color.HSV
 * @return {one.color.HSV}
 */

/**
 * @name one.color.CMYK.prototype.hsl
 * @description Convert the color to a {@link one.color.HSL} object.
 * @function
 * @requires one.color.HSL
 * @return {one.color.HSL}
 */

/**
 * @name one.color.CMYK.prototype.cmyk
 * @description Convert the color to a {@link one.color.CMYK} object, ie. return the object itself.
 * @function
 * @return {one.color.CMYK}
 */

/**
 * @name one.color.CMYK.prototype.hex
 * @description Get the standard RGB hex representation of the color.
 * @function
 * @return {String} The hex string, e.g. "#f681df"
 */

/**
 * @name one.color.CMYK.prototype.css
 * @description Get a valid CSS color representation of the color without an alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgb(123, 2, 202)"
 */

/**
 * @name one.color.CMYK.prototype.cssa
 * @description Get a valid CSS color representation of the color, including the alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgba(123, 2, 202, 0.253)"
 */

one.color.installColorSpace('CMYK', ['cyan', 'magenta', 'yellow', 'black', 'alpha'], {
    rgb: function () {
        return new one.color.RGB((1 - this._cyan * (1 - this._black) - this._black),
                                 (1 - this._magenta * (1 - this._black) - this._black),
                                 (1 - this._yellow * (1 - this._black) - this._black),
                                 this._alpha);
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.cmyk
        // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
        var red = this._red,
            green = this._green,
            blue = this._blue,
            cyan = 1 - red,
            magenta = 1 - green,
            yellow = 1 - blue,
            black = 1;
        if (red || green || blue) {
            black = Math.min(cyan, Math.min(magenta, yellow));
            cyan = (cyan - black) / (1 - black);
            magenta = (magenta - black) / (1 - black);
            yellow = (yellow - black) / (1 - black);
        } else {
            black = 1;
        }
        return new one.color.CMYK(cyan, magenta, yellow, black, this._alpha);
    }
});
