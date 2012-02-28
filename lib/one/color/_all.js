// This file is purely for the build system
one.include('lib:one/color/HSV.js');
one.include('lib:one/color/HSL.js');
one.include('lib:one/color/CMYK.js');
one.include('lib:one/color-namedColors.js');

// Convenience functions
one.include('lib:one/color/plugins/clearer.js');
one.include('lib:one/color/plugins/darken.js');

// Node module export
if (typeof module !== 'undefined') {
    module.exports = one.color;
}
