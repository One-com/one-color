/*jslint bitwise:false*/
/*global one*/
one.include('js:one/color.js');
one.include('js:one/color/RGB.js');

/**
 * Parse a hex string. Please use {@link one.color#parse} instead.
 * @param strHex The hex string, e.g. <tt>"#abc"</tt>,
 * <tt>"123abc"<tt>....
 * @return {one.color.RGB} Color object representing the parsed
 * color, or false if the string couldn't be parsed.
 * @private
 */
one.color.fromHex = function (strHex) {
    if (strHex.length < 6) {
        // Allow CSS shorthand
        strHex = strHex.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3');
    }
    // Split strHex into red, green, and blue components
    var hexMatch = strHex.match(/^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i);
    if (hexMatch) {
        return new one.color.RGB(
            parseInt(hexMatch[1], 16) / 255,
            parseInt(hexMatch[2], 16) / 255,
            parseInt(hexMatch[3], 16) / 255
        );
    }
};

/**
 * Regex for matching CSS RGBA color strings
 * @private
 */
one.color.rgbaRegex =/^rgba?\(\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*,\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*,\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*(?:,\s*(\.\d+|\d+(?:\.\d+))\s*)?\)/i;

/**
 * Parse a CSS RGBA string. Please use {@link one.color#parse} instead.
 * @param strCSS The CSS RGBA string, e.g. <tt>"rgb(100, 255, 100)"</tt>,
 * <tt>"rgba(0, 0, 255, 0.5)"<tt>, <tt>"rgb(0%, 100%, 0%)"</tt>....
 * @return {one.color.RGB} Color object representing the parsed
 * color, or false if the string couldn't be parsed.
 * @private
 */
one.color.fromCSSRGBA = function (strCSS) {
    var match = strCSS.match(one.color.rgbaRegex);

    if (match) {
        return new one.color.RGB(
            parseFloat(match[1]) / (match[2] ? 100 : 255),
            parseFloat(match[3]) / (match[4] ? 100 : 255),
            parseFloat(match[5]) / (match[6] ? 100 : 255),
            parseFloat(match[7])
        );
    }
};

/**
 * Parse a hex string, 24-bit integer or object representing a color.
 * If a one.color.(RGB|HSL|HSV|CMYK) object is provided, it will be returned
 * as-is, so in library code you can use {@link one.color.parse} to be flexible
 * about how colors are provided to you:
 * <pre><code>
function foo (color) {
color = color.parse(color);
// Now we are sure that color is a one.color.(RGB|CMYK|HSL|HSV) object, even if it was provided as a hex string.
}
 * </code></pre>
 * @param {String|Object} obj A hex string, integer value, or
 * object to parse.
 * @return {one.color.RGB|one.color.HSL|one.color.HSV|one.color.CMYK} Color object representing the
 * parsed color, or false if the input couldn't be parsed.
 */
one.color.parse = function (obj) {
    if (obj.charCodeAt) {
        return one.color.fromCSSRGBA(obj) || one.color.fromHex(obj);
    } else if (typeof obj === 'object' && obj.isColor) {
        return obj;
    } else if (Object.prototype.toString.apply(obj) === '[object Array]') {
        return new one.color[obj[0]](obj.slice(1, obj.length));
    } else if (!isNaN(obj)) {
        // Strange integer representation sometimes returned by document.queryCommandValue in some browser...
        return new one.color.RGB((obj & 0xFF) / 255, ((obj & 0xFF00) >> 8) / 255, ((obj & 0xFF0000) >> 16) / 255);
    }
    return false;
};
