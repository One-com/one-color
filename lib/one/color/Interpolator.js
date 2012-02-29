/*global one*/
one.include('lib:one/color.js');

/**
 * @constructor
 */
one.color.Interpolator = function (startColor, endColor, minValue, maxValue) {
    startColor = one.color.parse(startColor).rgb();
    endColor = one.color.parse(endColor).rgb();
    if (maxValue === minValue) {
        return function () {
            return startColor;
        };
    }
    var deltaR = endColor._red - startColor._red,
        deltaG = endColor._green - startColor._green,
        deltaB = endColor._blue - startColor._blue;
    return function (value) {
        var intensity = (value - minValue) / (maxValue - minValue);
        return new one.color.RGB(
            startColor._red + deltaR * intensity,
            startColor._green + deltaG * intensity,
            startColor._blue + deltaB * intensity
        );
    };
};
