module.exports = function grayscale(color) {
    function gs () {
        var rgb = this.rgb(),
            val = rgb._red * 0.3 + rgb._green * 0.59 + rgb._blue * 0.11;

        return new color.RGB(val, val, val, this._alpha);
    }

    color.installMethod('greyscale', gs);
    color.installMethod('grayscale', gs);
};
