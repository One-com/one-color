/*global one*/
one.include('js:one/color.js');

one.include('js:one/color-installColorSpace.js');
one.include('js:one/color/RGB.js');
one.include('js:one/color/HSV.js');

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
one.include('jslib:one/color/HSL.js');
one.include('jslib:one/color/CMYK.js');
one.include('jslib:one/color/RGB.js');

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
