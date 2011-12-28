// This file is purely for the build system
one.include('lib:one/color/HSV.js');
one.include('lib:one/color/HSL.js');
//one.include('lib:one/color/CMYK.js');

if (typeof module !== 'undefined') {
	module.exports = one.color;
}
