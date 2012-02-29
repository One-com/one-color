// This file is purely for the build system
one.include('lib:one/color/HSV.js');
one.include('lib:one/color/HSL.js');

if (typeof module !== 'undefined') {
    module.exports = ONECOLOR;
}
