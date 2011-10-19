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
    black(+.1, true). // Implicit conversion to CMYK (with alpha)
    green(-.1). // Implicit conversion to RGB (with alpha)
    toCSSWithAlpha(); // "rgba(198,0,203,0.9)"
</code></pre>
 *
 * @constructor
 * Create a new one.color.HSL object. Component values outside the
 * supported range, [0..1], will be adjusted automatically.
 * @param {Number} hue The hue component, range: [0..1]
 * @param {Number} saturation The saturation component, range: [0..1]
 * @param {Number} lightness The lightness component, range: [0..1]
 * @param {Number} [alpha] The alpha value, range: [0..1],
 * defaults to 1
 */

one.color.installColorSpace('HSL', ['hue', 'saturation', 'lightness', 'alpha'], {
    toHSV: function () {
        // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
        var saturation = this._saturation,
            lightness = this._lightness * 2;
        if (lightness <= 1) {
            saturation *= lightness;
        } else {
            saturation *= (2 - lightness);
        }
        return new one.color.HSV(this._hue, (2 * saturation) / (lightness + saturation), (lightness + saturation) / 2, this._alpha);
    },

    toRGB: function () {
        return this.toHSV().toRGB();
    },

    fromRGB: function () { // Becomes one.color.RGB.prototype.toHSV
        return this.toHSV().toHSL();
    }
});

/**
 * @name one.color.HSL.prototype.hue
 * @function
 * @param {Number} [hue] The new hue component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.HSL} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.saturation
 * @function
 * @param {Number} [saturation] The new saturation component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.HSL} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.lightness
 * @function
 * @param {Number} [lightness] The new lightness component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.HSL} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.HSL.prototype.alpha
 * @function
 * @param {Number} [alpha] The new alpha component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.HSL} The current value of the property,
 * or a new color object with the changed value.
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
