/*global one*/
one.include('lib:color.js');

ONECOLOR.Interpolator = function (startColor, endColor, minValue, maxValue) {
    startColor = ONECOLOR(startColor).rgb();
    endColor = ONECOLOR(endColor).rgb();
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
        return new ONECOLOR.RGB(
            startColor._red + deltaR * intensity,
            startColor._green + deltaG * intensity,
            startColor._blue + deltaB * intensity
        );
    };
};
