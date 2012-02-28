one.color.installMethod('negate', function () {
    var rgb = this.rgb();
    return new one.color.RGB(1 - rgb._red, 1 - rgb._green, 1 - rgb._blue, this._alpha);
});
