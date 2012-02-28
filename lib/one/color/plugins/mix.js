ONECOLOR.installMethod('mix', function (otherColor, weight) {
    var otherColor = ONECOLOR(otherColor),
        weight = 1 - (weight || 0.5),
        w = weight * 2 - 1,
        a = this._alpha - otherColor._alpha,
        weight1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2,
        weight2 = 1 - weight1,
        rgb = this.rgb(),
        otherColor = otherColor.rgb();

    return new ONECOLOR.RGB(
        this._red * weight1 + otherColor._red * weight2,
        this._green * weight1 + otherColor._green * weight2,
        this._blue * weight1 + otherColor._blue * weight2,
        this._alpha * weight + otherColor._alpha * (1 - weight)
    );
});
