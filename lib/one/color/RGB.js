/*global one*/
one.include('js:one/color.js');

one.include('js:one/color-installColorSpace.js');

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
one.include('jslib:one/color/RGB.js');
one.include('jslib:one/color/HSL.js');

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
