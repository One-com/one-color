var vows = require('vows'),
    assert = require('assert'),
    namedColorSamples = require('./samples'),
    spaces = [
        {
            name: 'RGB',
            channels: ['red', 'green', 'blue', 'alpha']
        },
        {
            name: 'HSV',
            channels: ['hue', 'saturation', 'value', 'alpha']
        },
        {
            name: 'HSL',
            channels: ['hue', 'saturation', 'lightness', 'alpha']
        }
    ];

function createTest(bundleFileName) {
    var Color = require(bundleFileName),
        colorChannels = [],
        colorSpaces = spaces.map(function (item) {
            colorChannels = colorChannels.concat(item.channels);
            return item.name;
        }),
        batch = {};

    if (/-all/.test(bundleFileName)) {
        var namedColorsBatch = batch['named colors'] = {};
        Object.keys(namedColorSamples).forEach(function (namedColor) {
            namedColorsBatch[namedColor] = {
                topic: Color(namedColor).hex()
            };
            namedColorsBatch[namedColor]['should come out as ' + namedColorSamples[namedColor]] = function (topic) {
                assert.equal(topic, namedColorSamples[namedColor].toLowerCase());
            };
        });
    }

    spaces.forEach(function (space) {
        var clr,
            context = {
                topic: space.name
            };

        context['is a funtion'] = function (spaceName) {
            assert.isFunction(Color[spaceName]);
        };
        context['can be constructed'] = function (spaceName) {
            clr = new Color[spaceName](0, 0, 0, 0);
            assert.isObject(clr);
        };
        context['is Color'] = function (spaceName) {
            assert.isTrue(clr.isColor);
        };

        colorSpaces.forEach(function (item) {
            context['has ' + item + ' conversion method'] = function (spaceName) {
                assert.isFunction(clr[item.toLowerCase()]);
            };
        });
        colorSpaces.forEach(function (item) {
            context[item + ' conversion'] = function (spaceName) {
                assert.isTrue(clr[item.toLowerCase()]().isColor);
            };
        });

        colorSpaces.forEach(function (item) {
            context['has equals method'] = function (spaceName) {
                assert.isFunction(clr.equals);
            };
        });
        colorSpaces.forEach(function (item) {
            context['equals'] = function (spaceName) {
                assert.isTrue(clr.equals(new Color[spaceName](0, 0, 0, 0)));
            };
        });
        colorSpaces.forEach(function (item) {
            context['JSON conversion'] = function (spaceName) {
                var color = new Color[spaceName](Math.random(), Math.random(), Math.random(), Math.random(), Math.random());
                assert.isTrue(color.equals(Color(color.toJSON())));
            };
        });

        var chans = {
            topic: new Color[space.name](0, 0, 0, 0)
        };
        space.channels.forEach(function (channel) {
            var shortHand = channel === 'black' ? 'k' : channel.charAt(0);

            chans[channel + ' getter/setter existance'] = function (color) {
                assert.isFunction(color[channel]);
            };
            chans[channel + ' getter/setter shorthand existance'] = function (color) {
                assert.isFunction(color[shortHand]);
            };
            chans[channel + ' getter'] = function (color) {
                assert.equal(color[channel](), 0);
            };
            chans[channel + ' getter shorthand'] = function (color) {
                assert.equal(color[shortHand](), 0);
            };
            chans[channel + ' setter'] = function (color) {
                assert.equal(color[channel](0)[channel](), 0);
                assert.equal(color[channel](0.5)[channel](), 0.5);
                if (channel === 'hue') {
                    // Hue is considered a circle, and thus has periodic boundary conditions
                    assert.equal(color[channel](1)[channel](), 0);
                    assert.equal(color[channel](-0.1)[channel](), 0.9);
                    assert.equal(color[channel](1.5)[channel](), 0.5);
                } else {
                    assert.equal(color[channel](1)[channel](), 1);
                    assert.equal(color[channel](-0.1)[channel](), 0);
                    assert.equal(color[channel](1.1)[channel](), 1);
                }
            };
            chans[channel + ' setter shorthand'] = function (color) {
                assert.equal(color[shortHand](0)[channel](), 0);
                assert.equal(color[shortHand](0.5)[channel](), 0.5);
                if (channel === 'hue') {
                    // Hue is considered a circle, and thus has periodic boundary conditions
                    assert.equal(color[shortHand](1)[channel](), 0);
                    assert.equal(color[shortHand](-0.1)[channel](), 0.9);
                    assert.equal(color[shortHand](1.5)[channel](), 0.5);
                } else {
                    assert.equal(color[shortHand](1)[channel](), 1);
                    assert.equal(color[shortHand](-0.1)[channel](), 0);
                    assert.equal(color[shortHand](1.1)[channel](), 1);
                }
            };
            chans[channel + ' adjustment'] = function (color) {
                assert.equal(color[channel](0.5, true)[channel](), 0.5);
            };
            chans[channel + ' adjustment shorthand'] = function (color) {
                assert.equal(color[shortHand](0.5, true)[channel](), 0.5);
            };
        });
        context['channels'] = chans;

        batch[space.name] = context;
    });

    /*
    valueOf: [Function: valueOf],
    hex: [Function],
    css: [Function],
    cssa: [Function],
    toJSON: [Function],
    toString: [Function]
    */
    return batch;
}

vows.describe('Color').addBatch({
    'base, debug': createTest('../one-color-debug'),
    'base, minified': createTest('../one-color')
}).export(module);


spaces.push(
    {
        name: 'XYZ',
        channels: ['x', 'y', 'z', 'alpha']
    },
    {
        name: 'LAB',
        channels: ['l', 'a', 'b', 'alpha']
    }/*
        name: 'CMYK',
        channels: ['cyan', 'magenta', 'yellow', 'black', 'alpha']
    }*/
);


vows.describe('Color-all').addBatch({
    'all, debug': createTest('../one-color-all-debug'),
    'all, minified': createTest('../one-color-all')
}).export(module);
