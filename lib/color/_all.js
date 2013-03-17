/*global one*/

// This file is purely for the build system
INCLUDE('lib:color.js');
INCLUDE('lib:color-namedColors.js');

// Order is important to prevent channel name clashes. Lab <-> hsL
INCLUDE('lib:color/XYZ.js');
INCLUDE('lib:color/LAB.js');
INCLUDE('lib:color/HSV.js');
INCLUDE('lib:color/HSL.js');
INCLUDE('lib:color/CMYK.js');

// Convenience functions
INCLUDE('lib:color/plugins/clearer.js');
INCLUDE('lib:color/plugins/darken.js');
INCLUDE('lib:color/plugins/desaturate.js');
INCLUDE('lib:color/plugins/greyscale.js');
INCLUDE('lib:color/plugins/lighten.js');
INCLUDE('lib:color/plugins/mix.js');
INCLUDE('lib:color/plugins/negate.js');
INCLUDE('lib:color/plugins/opaquer.js');
INCLUDE('lib:color/plugins/rotate.js');
INCLUDE('lib:color/plugins/saturate.js');
INCLUDE('lib:color/plugins/toAlpha.js');
