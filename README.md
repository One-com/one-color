# onecolor

[![NPM version](https://badge.fury.io/js/onecolor.svg)](http://badge.fury.io/js/onecolor)
[![Build Status](https://travis-ci.org/One-com/one-color.svg?branch=master)](https://travis-ci.org/One-com/one-color)
[![Coverage Status](https://img.shields.io/coveralls/One-com/one-color.svg)](https://coveralls.io/r/One-com/one-color?branch=master)
[![Dependency Status](https://david-dm.org/One-com/one-color.svg)](https://david-dm.org/One-com/one-color)

JavaScript color calculation toolkit for node.js and the browser.

Features:

- RGB, HSV, HSL, and CMYK colorspace support (experimental implementations of LAB and XYZ)
- Legal values for all channels are 0..1
- Instances are immutable -- a new object is created for each manipulation
- All internal calculations are done using floating point, so very little precision is lost due to rounding errors when converting between colorspaces
- Alpha channel support
- Extensible architecture -- implement your own colorspaces easily
- Chainable color manipulation
- Seamless conversion between colorspaces
- Outputs as hex, `rgb(...)`, or `rgba(...)`.

Module support:

- CommonJS / Node
- AMD / RequireJS
- Vanilla JS (installs itself on one.color)

Package managers:

- npm: `npm install onecolor`
- bower: `bower install color`

Small sizes:

- one-color.js ![](http://img.badgesize.io/One-com/one-color/master/one-color.js.svg?label=size) ![](http://img.badgesize.io/One-com/one-color/master/one-color.js.svg?label=gzip&compression=gzip) (Basic RGB, HSV, HSL)
- one-color-all.js ![](http://img.badgesize.io/One-com/one-color/master/one-color-all.js.svg?label=size) ![](http://img.badgesize.io/One-com/one-color/master/one-color-all.js.svg?label=gzip&compression=gzip) (Full RGB, HSV, HSL, CMYK, XYZ, LAB, named colors, [helper functions](https://github.com/One-com/one-color/tree/master/lib/plugins))

## Usage

In the browser (change <a href="//raw.github.com/One-com/one-color/master/one-color.js">one-color.js</a> to <a href="//raw.github.com/One-com/one-color/master/one-color-all.js">one-color-all.js</a> to gain
named color support):

```html
<script src="one-color.js"></script>
<script>
  alert(
    'Hello, ' + one.color('#650042').lightness(0.3).green(0.4).hex() + ' world!'
  );
</script>
```

In the browser, the parser is exposed as a global named `onecolor`.
In node.js, it is returned directly with a require of the module
(after `npm install onecolor`):

```javascript
var color = require('onecolor');
console.warn(color('rgba(100%, 0%, 0%, .5)').alpha(0.4).cssa());
```

```output
rgba(255,0,0,0.4)
```

All of the above return color instances in the relevant color space
with the channel values (0..1) as instance variables:

```javascript
var myColor = color('#a9d91d');
myColor instanceof color.RGB; // true
myColor.red(); // 0.6627450980392157
```

You can also parse named CSS colors (works out of the box in node.js,
but the requires the slightly bigger <a href="//raw.github.com/One-com/one-color/master/one-color-all.js">one-color-all.js</a> build in the
browser):

```javascript
color('maroon').lightness(0.3).hex(); // '#990000'
```

To turn a color instance back into a string, use the `hex()`, `css()`,
and `cssa()` methods:

```javascript
color('rgb(124, 96, 200)').hex(); // '#7c60c8'
color('#bb7b81').cssa(); // 'rgba(187,123,129,1)'
```

Color instances have getters/setters for all channels in all supported
colorspaces (`red()`, `green()`, `blue()`, `hue()`, `saturation()`, `lightness()`,
`value()`, `alpha()`, etc.). Thus you don't need to think about which colorspace
you're in. All the necessary conversions happen automatically:

```javascript
color('#ff0000') // Red in RGB
  .green(1) // Set green to the max value, producing yellow (still RGB)
  .hue(0.5, true) // Add 180 degrees to the hue, implicitly converting to HSV
  .hex(); // Dump as RGB hex syntax: '#2222ff'
```

When called without any arguments, they return the current value of
the channel (0..1):

```javascript
color('#09ffdd').green(); // 1
color('#09ffdd').saturation(); // 0.9647058823529412
```

When called with a single numerical argument (0..1), a new color
object is returned with that channel replaced:

```javascript
var myColor = color('#00ddff');
myColor.red(0.5).red(); // .5

// ... but as the objects are immutable, the original object retains its value:
myColor.red(); // 0
```

When called with a single numerical argument (0..1) and `true` as
the second argument, a new value is returned with that channel
adjusted:

```javascript
color('#ff0000') // Red
  .red(-0.1, true) // Adjust red channel by -0.1
  .hex(); // '#e60000'
```

## Alpha channel

All color instances have an alpha channel (0..1), defaulting to 1
(opaque). You can simply ignore it if you don't need it.

It's preserved when converting between colorspaces:

```javascript
color('rgba(10, 20, 30, .8)').green(0.4).saturation(0.2).alpha(); // 0.8
```

## Comparing color objects

If you need to know whether two colors represent the same 8 bit color, regardless
of colorspace, compare their `hex()` values:

```javascript
color('#f00').hex() === color('#e00').red(1).hex(); // true
```

Use the `equals` method to compare two color instances within a certain
epsilon (defaults to `1e-9`).

```javascript
color('#e00').lightness(0.00001, true).equals(color('#e00'), 1e-5); // false
color('#e00').lightness(0.000001, true).equals(color('#e00'), 1e-5); // true
```

Before comparing the `equals` method converts the other color to the right colorspace,
so you don't need to convert explicitly in this case either:

```javascript
color('#e00').hsv().equals(color('#e00')); // true
```

# API overview

Color parser function, the recommended way to create a color instance:

```javascript
color('#a9d91d'); // Regular hex syntax
color('a9d91d'); // hex syntax, # is optional
color('#eee'); // Short hex syntax
color('rgb(124, 96, 200)'); // CSS rgb syntax
color('rgb(99%, 40%, 0%)'); // CSS rgb syntax with percentages
color('rgba(124, 96, 200, .4)'); // CSS rgba syntax
color('hsl(120, 75%, 75%)'); // CSS hsl syntax
color('hsla(120, 75%, 75%, .1)'); // CSS hsla syntax
color('hsv(220, 47%, 12%)'); // CSS hsv syntax (non-standard)
color('hsva(120, 75%, 75%, 0)'); // CSS hsva syntax (non-standard)
color([0, 4, 255, 120]); // CanvasPixelArray entry, RGBA
color(['RGB', 0.5, 0.1, 0.6, 0.9]); // The output format of color.toJSON()
```

The slightly bigger <a href="//raw.github.com/One-com/one-color/master/one-color-all.js">one-color-all.js</a> build adds support for
<a href='http://en.wikipedia.org/wiki/Web_colors'>the standard suite of named CSS colors</a>:

```javascript
color('maroon');
color('darkolivegreen');
```

Existing onecolor instances pass through unchanged, which is useful
in APIs where you want to accept either a string or a color instance:

```javascript
color(color('#fff')); // Same as color('#fff')
```

Serialization methods:

```javascript
var myColor = color('#bda65b');

myColor.hex(); // 6-digit hex string: '#bda65b'
myColor.css(); // CSS rgb syntax: 'rgb(10,128,220)'
myColor.cssa(); // CSS rgba syntax: 'rgba(10,128,220,0.8)'
myColor.toString(); // For debugging: '[onecolor.RGB: Red=0.3 Green=0.8 Blue=0 Alpha=1]'
myColor.toJSON(); // ["RGB"|"HSV"|"HSL", <number>, <number>, <number>, <number>]
```

Getters -- return the value of the channel (converts to other colorspaces as needed):

```javascript
var myColor = color('#bda65b');

myColor.red();
myColor.green();
myColor.blue();
myColor.hue();
myColor.saturation();
myColor.value();
myColor.lightness();
myColor.alpha();
myColor.cyan(); // one-color-all.js and node.js only
myColor.magenta(); // one-color-all.js and node.js only
myColor.yellow(); // one-color-all.js and node.js only
myColor.black(); // one-color-all.js and node.js only
```

Setters -- return new color instances with one channel changed:

<!-- evaldown evaluate:false -->

```javascript
color.red(<number>)
color.green(<number>)
color.blue(<number>)
color.hue(<number>)
color.saturation(<number>)
color.value(<number>)
color.lightness(<number>)
color.alpha(<number>)
color.cyan(<number>)    // one-color-all.js and node.js only
color.magenta(<number>) // one-color-all.js and node.js only
color.yellow(<number>)  // one-color-all.js and node.js only
color.black(<number>)   // one-color-all.js and node.js only
```

Adjusters -- return new color instances with the channel adjusted by
the specified delta (0..1):

<!-- evaldown evaluate:false -->

```javascript
color.red(<number>, true)
color.green(<number>, true)
color.blue(<number>, true)
color.hue(<number>, true)
color.saturation(<number>, true)
color.value(<number>, true)
color.lightness(<number>, true)
color.alpha(<number>, true)
color.cyan(<number>, true)    // one-color-all.js and node.js only
color.magenta(<number>, true) // one-color-all.js and node.js only
color.yellow(<number>, true)  // one-color-all.js and node.js only
color.black(<number>, true)   // one-color-all.js and node.js only
```

Comparison with other color objects, returns `true` or `false` (epsilon defaults to `1e-9`):

<!-- evaldown evaluate:false -->

```javascript
color.equals(otherColor[, <epsilon>])
```

## Mostly for internal (and plugin) use:

"Low level" constructors, accept 3 or 4 numerical arguments (0..1):

```javascript
new onecolor.RGB(<red>, <green>, <blue>[, <alpha>])
new onecolor.HSL(<hue>, <saturation>, <lightness>[, <alpha>])
new onecolor.HSV(<hue>, <saturation>, <value>[, <alpha>])
```

The <a href="//raw.github.com/One-com/one-color/master/one-color-all.js">one-color-all.js</a> build includes CMYK support:

```javascript
new onecolor.CMYK(<cyan>, <magenta>, <yellow>, <black>[, <alpha>])
```

All color instances have `rgb()`, `hsv()`, and `hsl()` methods for
explicitly converting to another color space. Like the setter and
adjuster methods they return a new color object representing the same
color in another color space.

If for some reason you need to get all the channel values in a
specific colorspace, do an explicit conversion first to cut down on
the number of implicit conversions:

```javascript
var myColor = color('#0620ff').lightness(+0.3).rgb();

console.log(myColor.red() + ' ' + myColor.green() + ' ' + myColor.blue());
```

```output
0 0.06265060240963878 0.5999999999999999
```

# Building

```
git clone https://github.com/One-com/one-color.git
cd one-color
npm install
npm run build
```

If you aren't up for a complete installation, there are pre-built
packages in the repository as well as the npm package:

- Basic library: <a href="//raw.github.com/One-com/one-color/master/one-color.js">one-color.js</a>
- Full library including named color support: <a href="//raw.github.com/One-com/one-color/master/one-color-all.js">one-color-all.js</a>

# License

onecolor is licensed under a standard 2-clause BSD license -- see the `LICENSE` file for details.
