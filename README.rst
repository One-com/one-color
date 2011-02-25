one.color
=========
one.color is a javascript color calculation toolkit.
Works in Node.js and in the browser.

Features
========
* RGB, HSV, HSL and CMYK color space implementations
* Alpha channel
* Extensible architectre - implement your own color spaces easily
* Chainable color manipulation
* Seamless conversion between color spaces on demand
* Outputs as Hex, RBG or HSV in css syntax with or without alpha channel

Building
========
The makefile uses `AssetGraph <https://github.com/One-com/assetgraph>`_ for resolving the javascript dependencies.
If you aren't up for a complete installation, take a look at the pre-build packages in the 'build' directory.

Documentation
=============
The API is documented in the source code and can be built using `JSDoc <http://jsdoc.sourceforge.net/>`_.

Usage Example
=============
one.color.(RGB|HSL|HSV|CMYK) objects are designed to be immutable; all the conversion, set, and adjust methods return new objects.
one.color.(RGB|HSL|HSV|CMYK) objects automatically get the set and adjust methods from all other installed colorspaces, so although you can use the explicit conversion methods one.color.RGB.toHSL(), one.color.RGB.toCMYK():

Example::
	new one.color.RGB(.4, .3, .9).
	    adjustLightness(+.2). // Implicit conversion to HSL
	    setRed(-.1). // Implicit conversion back to RGB
	    toHex(); // "#00a6f2"

License
========
one.color is licensed under a standard 3-clause BSD license -- see the LICENSE-file for details.
