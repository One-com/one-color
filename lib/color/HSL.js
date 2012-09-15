/*global one*/
INCLUDE('lib:color.js');

INCLUDE('lib:color/HSV.js');

installColorSpace('HSL', ['h', 's', 'l', 'a'], {
    hsv: function () {
        // Algorithm adapted from http://wiki.secondlife.com/wiki/Color_conversion_scripts
        var that = this,
            l = that._l * 2,
            s = that._s * ((l <= 1) ? l : 2 - l),
            saturation;

        // Avoid division by zero when l + s is very small (approaching black):
        if (l + s < 1e-9) {
            saturation = 0;
        } else {
            saturation = (2 * s) / (l + s);
        }

        return new ONECOLOR.HSV(that._h, saturation, (l + s) / 2, that._a);
    },

    rgb: function () {
        return this.hsv().rgb();
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.hsv
        return this.hsv().hsl();
    }
});
