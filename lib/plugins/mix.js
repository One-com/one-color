module.exports = function mix(color) {
    color.installMethod('mix', function (otherColor, weight) {
        otherColor = color(otherColor).rgb();
        weight = 1 - (isNaN(weight) ? 0.5 : weight);

        var w = weight * 2 - 1,
            a = this._alpha - othercolor._alpha,
            weight1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2,
            weight2 = 1 - weight1,
            rgb = this.rgb();

        return new color.RGB(
            rgb._red * weight1 + othercolor._red * weight2,
            rgb._green * weight1 + othercolor._green * weight2,
            rgb._blue * weight1 + othercolor._blue * weight2,
            rgb._alpha * weight + othercolor._alpha * (1 - weight)
        );
    });
};
