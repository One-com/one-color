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
var suite = vows.describe('Color');
var clr = new Color.RGB(0, 0, 0, 1);
var batch = {}
spaces.forEach(function(space) {
    var context = {
        topic: space.name
    };

    context['is a function'] = function (spaceName) {
        assert.isFunction(Color[spaceName]);
    };
    context['has conversion method'] = function (spaceName) {
        assert.isFunction(clr[spaceName.toLowerCase()]);
        assert.isTrue(clr[spaceName.toLowerCase()]().isColor);
    };

    var chans = {
        topic: new Color[space.name](0, 0, 0, 1)
    }
    space.channels.forEach(function(channel) {
        chans['has ' + channel + ' getter/setter'] = function (color) {
            assert.isFunction(color[channel]);
        };
    });
    context['channels'] = chans;

    batch[space.name] = context;
});

suite.addBatch({
    'Color API': batch
}).export(module);