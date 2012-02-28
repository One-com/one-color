(function () {
    function gs () {
        var rgb = this.rgb(),
            val = rgb._red * 0.3 + rgb._green * 0.59 + rgb._blue * 0.11;

        return new one.color.RGB(val, val, val, this._alpha);
    };

    one.color.installMethod('greyscale', gs);
    one.color.installMethod('grayscale', gs);
}());
