module.exports = function CMYK(color) {
  color.installColorSpace(
    'CMYK',
    ['cyan', 'magenta', 'yellow', 'black', 'alpha'],
    {
      rgb: function () {
        return new color.RGB(
          1 - this._cyan * (1 - this._black) - this._black,
          1 - this._magenta * (1 - this._black) - this._black,
          1 - this._yellow * (1 - this._black) - this._black,
          this._alpha
        );
      },

      fromRgb: function () {
        // Becomes one.color.RGB.prototype.cmyk
        // Adapted from http://www.javascripter.net/faq/rgb2cmyk.htm
        var red = this._red;
        var green = this._green;
        var blue = this._blue;
        var cyan = 1 - red;
        var magenta = 1 - green;
        var yellow = 1 - blue;
        var black = 1;
        if (red || green || blue) {
          black = Math.min(cyan, Math.min(magenta, yellow));
          cyan = (cyan - black) / (1 - black);
          magenta = (magenta - black) / (1 - black);
          yellow = (yellow - black) / (1 - black);
        } else {
          black = 1;
        }
        return new color.CMYK(cyan, magenta, yellow, black, this._alpha);
      },
    }
  );
};
