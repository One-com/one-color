// This file is purely for the build system
one.include('lib:one/color/HSV.js');
one.include('lib:one/color/HSL.js');
one.include('lib:one/color/CMYK.js');
one.include('lib:one/color-namedColors.js');

// Convenience functions
one.include('lib:one/color/plugins/clearer.js');
one.include('lib:one/color/plugins/darken.js');
one.include('lib:one/color/plugins/desaturate.js');
one.include('lib:one/color/plugins/greyscale.js');
one.include('lib:one/color/plugins/lighten.js');
one.include('lib:one/color/plugins/mix.js');
one.include('lib:one/color/plugins/negate.js');
one.include('lib:one/color/plugins/opaquer.js');
one.include('lib:one/color/plugins/rotate.js');
one.include('lib:one/color/plugins/saturate.js');
one.include('lib:one/color/plugins/toAlpha.js');

// Node module export
if (typeof module !== 'undefined') {
    module.exports = one.color;
}
