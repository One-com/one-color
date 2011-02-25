/*global one*/
one.include('js:one/color.js');

one.include('js:one/color-installColorSpace.js');
one.include('js:one/color/RGB.js');

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
one.include('jslib:one/color/HSV.js');
one.include('jslib:one/color/RGB.js');
one.include('jslib:one/color/CMYK.js');

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
