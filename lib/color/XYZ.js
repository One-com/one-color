/*global INCLUDE, installColorSpace, ONECOLOR*/
INCLUDE('lib:color.js');

installColorSpace('XYZ', ['x', 'y', 'z', 'alpha'], {
    fromRgb: function () {
        // http://www.easyrgb.com/index.php?X=MATH&H=02#text2
        var convert = function (channel) {
                // assume sRGB
                return 100 * (channel > 0.04045 ?
                    Math.pow((channel + 0.055) / 1.055, 2.4) :
                    channel / 12.92);
            },
            r = convert(this._red),
            g = convert(this._green),
            b = convert(this._blue);

        return new ONECOLOR.XYZ(
            r * 0.4124 + g * 0.3576 + b * 0.1805,
            r * 0.2126 + g * 0.7152 + b * 0.0722,
            r * 0.0193 + g * 0.1192 + b * 0.9505,
            this._alpha
        );
    },

    rgb: function () {
        // http://www.easyrgb.com/index.php?X=MATH&H=01#text1
        var x = this._x / 100,
            y = this._y / 100,
            z = this._z / 100,
            convert = function (channel) {
                return channel > 0.0031308 ?
                    1.055 * Math.pow(channel, 1 / 2.4) - 0.055 :
                    12.92 * channel;
            };

        return new ONECOLOR.RGB(
            convert(x *  3.2406 + y * -1.5372 + z * -0.4986),
            convert(x * -0.9689 + y *  1.8758 + z *  0.0415),
            convert(x *  0.0557 + y * -0.2040 + z *  1.0570),
            this._alpha
        );
    },

    lab: function () {
        // http://www.easyrgb.com/index.php?X=MATH&H=07#text7
        var convert = function (channel) {
                return channel > 0.008856 ?
                    Math.pow(channel, 1 / 3) :
                    7.787037 * channel + 4 / 29;
            },
            x = convert(this._x /  95.047),
            y = convert(this._y / 100.000),
            z = convert(this._z / 108.883);

        return new ONECOLOR.LAB(
            (116 * y) - 16,
            500 * (x - y),
            200 * (y - z),
            this._alpha
        );
    }
});
