one.color
=========
one.color is a JavaScript color calculation toolkit.
Works in node.js and in the browser.
The color object automatically installs implicit conversions to different color spaces when needed, and adds get/set/adjust methods of any color channel in any available color space.
All implicit conversions are done using floating point, so no precision is lost due to rounding errors when converting between color spaces.

Features
========
* RGB, HSV, HSL and CMYK color space implementations
* Alpha channel
* Extensible architecture - implement your own color spaces easily
* Chainable color manipulation
* Seamless conversion between color spaces on demand
* Outputs as Hex, RBG or HSV in css syntax with or without alpha channel

Usage Example
=============
one.color.(RGB|HSL|HSV|CMYK) objects are designed to be immutable; all the conversion, set, and adjust methods return new objects.
one.color.(RGB|HSL|HSV|CMYK) objects automatically get the set and adjust methods from all other installed colorspaces, so although you can use the explicit conversion methods one.color.RGB.toHSL(), one.color.RGB.toCMYK():

Example::

	new one.color.RGB(.4, .3, .9).
	    adjustLightness(+.2). // Implicit conversion to HSL
	    setRed(-.1). // Implicit conversion back to RGB
	    toHex(); // "#00a6f2"

Documentation
=============
The API is documented in the source code and can be built using `JSDoc <http://code.google.com/p/jsdoc-toolkit/>`_.

Building
========
The Makefile uses `AssetGraph <https://github.com/One-com/assetgraph>`_ for resolving the JavaScript dependencies.

If you aren't up for a complete installation, take a look at the pre-built packages:

* `one-color.js <one-color.js>`_
* `one-color-debug.js <one-color-debug.js>`_

License
========
one.color is licensed under a standard 3-clause BSD license -- see the LICENSE-file for details.
