/*global one*/
INCLUDE('lib:color.js');

installColorSpace('CMYK', ['c', 'm', 'y', 'k', 'a'], {
    rgb: function () {
        return new ONECOLOR.RGB((1 - this._c * (1 - this._b) - this._b),
                                 (1 - this._m * (1 - this._b) - this._b),
                                 (1 - this._y * (1 - this._b) - this._b),
                                 this._a);
    },

    fromRgb: function () { // Becomes one.color.RGB.prototype.cmyk
        // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
        var red = this._r,
            green = this._g,
            blue = this._b,
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
        return new ONECOLOR.CMYK(cyan, magenta, yellow, black, this._a);
    }
});
