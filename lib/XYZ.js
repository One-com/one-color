module.exports = function XYZ(color) {
  color.installColorSpace('XYZ', ['x', 'y', 'z', 'alpha'], {
    fromRgb: function () {
      // http://www.easyrgb.com/index.php?X=MATH&H=02#text2
      var convert = function (channel) {
        return channel > 0.04045
          ? Math.pow((channel + 0.055) / 1.055, 2.4)
          : channel / 12.92;
      };
      var r = convert(this._red);
      var g = convert(this._green);
      var b = convert(this._blue);

      // Reference white point sRGB D65:
      // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
      return new color.XYZ(
        r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
        r * 0.2126729 + g * 0.7151522 + b * 0.072175,
        r * 0.0193339 + g * 0.119192 + b * 0.9503041,
        this._alpha
      );
    },

    rgb: function () {
      // http://www.easyrgb.com/index.php?X=MATH&H=01#text1
      var x = this._x;
      var y = this._y;
      var z = this._z;
      var convert = function (channel) {
        return channel > 0.0031308
          ? 1.055 * Math.pow(channel, 1 / 2.4) - 0.055
          : 12.92 * channel;
      };

      // Reference white point sRGB D65:
      // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
      return new color.RGB(
        convert(x * 3.2404542 + y * -1.5371385 + z * -0.4985314),
        convert(x * -0.969266 + y * 1.8760108 + z * 0.041556),
        convert(x * 0.0556434 + y * -0.2040259 + z * 1.0572252),
        this._alpha
      );
    },

    lab: function () {
      // http://www.easyrgb.com/index.php?X=MATH&H=07#text7
      var convert = function (channel) {
        return channel > 0.008856
          ? Math.pow(channel, 1 / 3)
          : 7.787037 * channel + 4 / 29;
      };
      var x = convert(this._x / 95.047);
      var y = convert(this._y / 100.0);
      var z = convert(this._z / 108.883);

      return new color.LAB(
        116 * y - 16,
        500 * (x - y),
        200 * (y - z),
        this._alpha
      );
    },
  });
};
