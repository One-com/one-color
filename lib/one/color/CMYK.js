/*global one*/
one.include('js:one/color.js');
one.include('js:one/color-installColorSpace.js');
one.include('js:one/color/RGB.js');

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
one.include('jslib:one/color/CMYK.js');
one.include('jslib:one/color/RGB.js');
one.include('jslib:one/color/HSL.js');

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
