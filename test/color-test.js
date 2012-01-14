var Color = require("../one-color-debug.js"),
    vows = require('vows'),
    assert = require('assert'),
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
        }/*,
        {
            name: 'CMYK',
            channels: ['cyan', 'magenta', 'yellow', 'black', 'alpha']
        }*/
    ];
var colorChannels = [];
var colorSpaces = spaces.map(function (item) {
    colorChannels = colorChannels.concat(item.channels);
    return item.name;
});

var suite = vows.describe('Color');
var batch = {};

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

    var chans = {
        topic: new Color[space.name](0, 0, 0, 0)
    }
    space.channels.forEach(function(channel) {
        chans[channel + ' getter/setter existance'] = function (color) {
            assert.isFunction(color[channel]);
        };
        chans[channel + ' getter'] = function (color) {
            assert.equal(color[channel](), 0);
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
        chans[channel + ' adjustment'] = function (color) {
            assert.equal(color[channel](0.5, true)[channel](), 0.5);
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

suite.addBatch({
    'API': batch
}).export(module);