/*global one*/
one.include('js:one/color.js');

/**
 * @constructor
 */
one.color.Interpolator = function (startColor, endColor, minValue, maxValue) {
    startColor = one.color.parse(startColor).toRGB();
    endColor = one.color.parse(endColor).toRGB();
    if (maxValue === minValue) {
        return function () {
            return startColor;
        };
    }
    var deltaR = endColor.r - startColor.r,
        deltaG = endColor.g - startColor.g,
        deltaB = endColor.b - startColor.b;
    return function (value) {
        var intensity = (value - minValue) / (maxValue - minValue);
        return new one.color.RGB(startColor.r + deltaR * intensity, startColor.g + deltaG * intensity, startColor.b + deltaB * intensity);
    };
};
