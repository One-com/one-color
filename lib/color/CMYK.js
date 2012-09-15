/*global one*/
INCLUDE('lib:color.js');

installColorSpace('CMYK', ['c', 'm', 'y', 'k', 'a'], {
    rgb: function () {
        var that = this;
        return new ONECOLOR.RGB((1 - that._c * (1 - that._b) - that._b),
                                 (1 - that._m * (1 - that._b) - that._b),
                                 (1 - that._y * (1 - that._b) - that._b),
                                 that._a);
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.cmyk
        // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
        var that = this,
            red = that._r,
            green = that._g,
            blue = that._b,
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
        return new ONECOLOR.CMYK(cyan, magenta, yellow, black, that._a);
    }
});
