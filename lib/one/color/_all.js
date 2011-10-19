// This file is purely for the build system
one.include('js:one/color/HSV.js');
one.include('js:one/color/HSL.js');
one.include('js:one/color/CMYK.js');

if (module) {
	module.exports = one.color;
}
