/*global one*/
one.include('lib:one/color.js');

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
 * one.color.HSV#rgb}, {@link one.color.HSV#hsl}...), the below
 * will work just fine:</p><pre><code>
one.include('jslib:one/color/HSV.js');
one.include('jslib:one/color/CMYK.js');

new one.color.HSV(.9, .2, .4).
    blue(-.4, true). // Implicit conversion to RGB
    cyan(-.1). // Implicit conversion to CMYK
    hex(); // "#665200"
</code></pre>
 *
 * @constructor
 * Create a new one.color.HSV object. Component values outside the
 * supported range, [0..1], will be adjusted automatically.
 * @param {Number} hue The hue component, range: [0..1]
 * @param {Number} saturation The saturation component, range: [0..1]
 * @param {Number} value The value component, range: [0..1]
 * @param {Number} [alpha] The alpha value, range: [0..1],
 * defaults to 1
 */

/**
 * @name one.color.HSV.prototype.hue
 * @function
 * @param {Number} [hue] The new hue component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.HSV} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.saturation
 * @function
 * @param {Number} [saturation] The new saturation component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.HSV} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.value
 * @function
 * @param {Number} [value] The new value component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.HSV} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.alpha
 * @function
 * @param {Number} [alpha] The new alpha component, range: [0..1]. If
 * not provided, the current value will be returned.
 * @param {Boolean} [isDelta] Whether the new value is relative to the
 * old value of the property. If the resulting value falls outside the
 * supported range, [0..1], it will be adjusted automatically.
 * @return {Number|one.color.HSV} The current value of the property,
 * or a new color object with the changed value.
 */

/**
 * @name one.color.HSV.prototype.toJSON
 * @description Convert the color to a JSON representation.
 * @function
 * @return {Array}
 */

/**
 * @name one.color.HSV.prototype.rgb
 * @description Convert the color to a {@link one.color.RGB} object.
 * @function
 * @return {one.color.RGB}
 */

/**
 * @name one.color.HSV.prototype.hsv
 * @description Convert the color to a {@link one.color.HSV} object, ie. return the object itself.
 * @function
 * @return {one.color.HSV}
 */

/**
 * @name one.color.HSV.prototype.hsl
 * @description Convert the color to a {@link one.color.HSL} object.
 * @function
 * @requires one.color.HSL
 * @return {one.color.HSL}
 */

/**
 * @name one.color.HSV.prototype.cmyk
 * @description Convert the color to a {@link one.color.CMYK} object.
 * @function
 * @include one.color.CMYK
 * @return {one.color.CMYK}
 */

/**
 * @name one.color.HSV.prototype.hex
 * @description Get the standard RGB hex representation of the color.
 * @function
 * @return {String} The hex string, e.g. "#f681df"
 */

/**
 * @name one.color.HSV.prototype.css
 * @description Get a valid CSS color representation of the color without an alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgb(123, 2, 202)"
 */

/**
 * @name one.color.HSV.prototype.cssa
 * @description Get a valid CSS color representation of the color, including the alpha value.
 * @function
 * @return {String} The CSS color string, e.g. "rgba(123, 2, 202, 0.253)"
 */
ONECOLOR.installColorSpace('HSV', ['hue', 'saturation', 'value', 'alpha'], {
    rgb: function () {
        var hue = this._hue,
            saturation = this._saturation,
            value = this._value,
            i = Math.min(5, Math.floor(hue * 6)),
            f = hue * 6 - i,
            p = value * (1 - saturation),
            q = value * (1 - f * saturation),
            t = value * (1 - (1 - f) * saturation),
            red,
            green,
            blue;
        switch (i) {
        case 0:
            red = value;
            green = t;
            blue = p;
            break;
        case 1:
            red = q;
            green = value;
            blue = p;
            break;
        case 2:
            red = p;
            green = value;
            blue = t;
            break;
        case 3:
            red = p;
            green = q;
            blue = value;
            break;
        case 4:
            red = t;
            green = p;
            blue = value;
            break;
        case 5:
            red = value;
            green = p;
            blue = q;
            break;
        }
        return new ONECOLOR.RGB(red, green, blue, this._alpha);
    },

    hsl: function () {
        var l = (2 - this._saturation) * this._value,
            sv = this._saturation * this._value,
            svDivisor = l <= 1 ? l : (2 - l),
            saturation;

        // Avoid division by zero when lightness approaches zero:
        if (svDivisor < 1e-9) {
            saturation = 0;
        } else {
            saturation = sv / svDivisor;
        }
        return new ONECOLOR.HSL(this._hue, saturation, l / 2, this._alpha);
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
        var red = this._red,
            green = this._green,
            blue = this._blue,
            max = Math.max(red, green, blue),
            min = Math.min(red, green, blue),
            delta = max - min,
            hue,
            saturation = (max === 0) ? 0 : (delta / max),
            value = max;
        if (delta === 0) {
            hue = 0;
        } else {
            switch (max) {
            case red:
                hue = (green - blue) / delta / 6 + (green < blue ? 1 : 0);
                break;
            case green:
                hue = (blue - red) / delta / 6 + 1 / 3;
                break;
            case blue:
                hue = (red - green) / delta / 6 + 2 / 3;
                break;
            }
        }
        return new ONECOLOR.HSV(hue, saturation, value, this._alpha);
    }
});
