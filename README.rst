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
* Outputs as Hex, RGB or HSV in css syntax with or without alpha channel

Usage Example
=============
one.color.(RGB|HSL|HSV|CMYK) objects are designed to be immutable; all the conversion, set, and adjust methods return new objects.
one.color.(RGB|HSL|HSV|CMYK) objects automatically get the set and adjust methods from all other installed colorspaces, so although you can use the explicit conversion methods such as one.color.RGB.hsl(), one.color.RGB.cmyk():

Example::

	new one.color.RGB(.4, .3, .9).
	    lightness(+.2, true). // Implicit conversion to HSL
	    red(-.1). // Implicit conversion back to RGB
	    hex(); // "#00a6f2"

Documentation
=============

Base class overview::

	one = { // General namespace for One.com libs
	    color = function( one.color.* | Array | String | Int ), // Parser
	    installColorSpace: function ( str space, [str channelNames], obj methods )
	};
	one.color.RGB  = function ( [0;1], [0;1], [0;1], [0;1] ); // Constructor
	one.color.HSV  = function ( [0;1], [0;1], [0;1], [0;1] ); // Constructor
	one.color.HSL  = function ( [0;1], [0;1], [0;1], [0;1] ); // Constructor
	one.color.CMYK = function ( [0;1], [0;1], [0;1], [0;1] ); // Constructor

Methods on an instance of one.color.( RGB | HSL | HSV | CMYK)::

	toString()                    → "[one.color.RGB: Red=0 Green=0 Blue=0 Alpha=1]" // For debugging
	hex()                         → "#RRGGBB"
	css()                         → "rgb([0;255], [0;255], [0;255])"
	cssa()                        → "rgb([0;255], [0;255], [0;255], [0;1])"
	toJSON()                      → ["RGB", [0;1], [0;1], [0;1], [0;1]] // As understood by one.color(Array)
	equals(otherColor, ε = 10^-9) → Boolean
	[colorSpace]()                → one.color[colorSpace] // Conversion method
	[channelName]()               → Number [0;1] // Get, implicit color space conversion
	[channelName]([0;1])          → new one.color[colorSpace], channelName =  [0;1] // Set, implicit color space conversion
	[channelName](±[0;1], true)   → new one.color[colorSpace], channelName ±= [0;1] // Adjust, implicit color space conversion


The API is documented in the source code and can be built using `JSDoc <http://code.google.com/p/jsdoc-toolkit/>`_.

Building
========
The Makefile uses `AssetGraph <https://github.com/One-com/assetgraph>`_ for resolving the JavaScript dependencies.

If you aren't up for a complete installation, take a look at the pre-built packages:

* `one-color.js <one-color/one-color.js>`_
* `one-color-debug.js <one-color/one-color-debug.js>`_

License
========
one.color is licensed under a standard 3-clause BSD license -- see the LICENSE-file for details.
