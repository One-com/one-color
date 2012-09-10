var vows = require('vows'),
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

var namedColorSamples = {
    AliceBlue: '#F0F8FF',
    AntiqueWhite: '#FAEBD7',
    Aqua: '#00FFFF',
    Aquamarine: '#7FFFD4',
    Azure: '#F0FFFF',
    Beige: '#F5F5DC',
    Bisque: '#FFE4C4',
    Black: '#000000',
    BlanchedAlmond: '#FFEBCD',
    Blue: '#0000FF',
    BlueViolet: '#8A2BE2',
    Brown: '#A52A2A',
    BurlyWood: '#DEB887',
    CadetBlue: '#5F9EA0',
    Chartreuse: '#7FFF00',
    Chocolate: '#D2691E',
    Coral: '#FF7F50',
    CornflowerBlue: '#6495ED',
    Cornsilk: '#FFF8DC',
    Crimson: '#DC143C',
    Cyan: '#00FFFF',
    DarkBlue: '#00008B',
    DarkCyan: '#008B8B',
    DarkGoldenRod: '#B8860B',
    DarkGray: '#A9A9A9',
    DarkGrey: '#A9A9A9',
    DarkGreen: '#006400',
    DarkKhaki: '#BDB76B',
    DarkMagenta: '#8B008B',
    DarkOliveGreen: '#556B2F',
    Darkorange: '#FF8C00',
    DarkOrchid: '#9932CC',
    DarkRed: '#8B0000',
    DarkSalmon: '#E9967A',
    DarkSeaGreen: '#8FBC8F',
    DarkSlateBlue: '#483D8B',
    DarkSlateGray: '#2F4F4F',
    DarkSlateGrey: '#2F4F4F',
    DarkTurquoise: '#00CED1',
    DarkViolet: '#9400D3',
    DeepPink: '#FF1493',
    DeepSkyBlue: '#00BFFF',
    DimGray: '#696969',
    DimGrey: '#696969',
    DodgerBlue: '#1E90FF',
    FireBrick: '#B22222',
    FloralWhite: '#FFFAF0',
    ForestGreen: '#228B22',
    Fuchsia: '#FF00FF',
    Gainsboro: '#DCDCDC',
    GhostWhite: '#F8F8FF',
    Gold: '#FFD700',
    GoldenRod: '#DAA520',
    Gray: '#808080',
    Grey: '#808080',
    Green: '#008000',
    GreenYellow: '#ADFF2F',
    HoneyDew: '#F0FFF0',
    HotPink: '#FF69B4',
    Ivory: '#FFFFF0',
    Khaki: '#F0E68C',
    Lavender: '#E6E6FA',
    LavenderBlush: '#FFF0F5',
    LawnGreen: '#7CFC00',
    LemonChiffon: '#FFFACD',
    LightBlue: '#ADD8E6',
    LightCoral: '#F08080',
    LightCyan: '#E0FFFF',
    LightGoldenRodYellow: '#FAFAD2',
    LightGray: '#D3D3D3',
    LightGrey: '#D3D3D3',
    LightGreen: '#90EE90',
    LightPink: '#FFB6C1',
    LightSalmon: '#FFA07A',
    LightSeaGreen: '#20B2AA',
    LightSkyBlue: '#87CEFA',
    LightSlateGray: '#778899',
    LightSlateGrey: '#778899',
    LightSteelBlue: '#B0C4DE',
    LightYellow: '#FFFFE0',
    Lime: '#00FF00',
    LimeGreen: '#32CD32',
    Linen: '#FAF0E6',
    Magenta: '#FF00FF',
    Maroon: '#800000',
    MediumAquaMarine: '#66CDAA',
    MediumBlue: '#0000CD',
    MediumOrchid: '#BA55D3',
    MediumPurple: '#9370D8',
    MediumSeaGreen: '#3CB371',
    MediumSlateBlue: '#7B68EE',
    MediumSpringGreen: '#00FA9A',
    MediumTurquoise: '#48D1CC',
    MediumVioletRed: '#C71585',
    MidnightBlue: '#191970',
    MintCream: '#F5FFFA',
    MistyRose: '#FFE4E1',
    Moccasin: '#FFE4B5',
    NavajoWhite: '#FFDEAD',
    Navy: '#000080',
    OldLace: '#FDF5E6',
    Olive: '#808000',
    OliveDrab: '#6B8E23',
    Orange: '#FFA500',
    OrangeRed: '#FF4500',
    Orchid: '#DA70D6',
    PaleGoldenRod: '#EEE8AA',
    PaleGreen: '#98FB98',
    PaleTurquoise: '#AFEEEE',
    PaleVioletRed: '#D87093',
    PapayaWhip: '#FFEFD5',
    PeachPuff: '#FFDAB9',
    Peru: '#CD853F',
    Pink: '#FFC0CB',
    Plum: '#DDA0DD',
    PowderBlue: '#B0E0E6',
    Purple: '#800080',
    Red: '#FF0000',
    RosyBrown: '#BC8F8F',
    RoyalBlue: '#4169E1',
    SaddleBrown: '#8B4513',
    Salmon: '#FA8072',
    SandyBrown: '#F4A460',
    SeaGreen: '#2E8B57',
    SeaShell: '#FFF5EE',
    Sienna: '#A0522D',
    Silver: '#C0C0C0',
    SkyBlue: '#87CEEB',
    SlateBlue: '#6A5ACD',
    SlateGray: '#708090',
    SlateGrey: '#708090',
    Snow: '#FFFAFA',
    SpringGreen: '#00FF7F',
    SteelBlue: '#4682B4',
    Tan: '#D2B48C',
    Teal: '#008080',
    Thistle: '#D8BFD8',
    Tomato: '#FF6347',
    Turquoise: '#40E0D0',
    Violet: '#EE82EE',
    Wheat: '#F5DEB3',
    White: '#FFFFFF',
    WhiteSmoke: '#F5F5F5',
    Yellow: '#FFFF00',
    YellowGreen: '#9ACD32'
};

function createTest(bundleFileName) {
    var Color = require(bundleFileName);
    var colorChannels = [];
    var colorSpaces = spaces.map(function (item) {
        colorChannels = colorChannels.concat(item.channels);
        return item.name;
    });

    var batch = {};

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
    'all, debug': createTest('../one-color-all-debug'),
    'all, minified': createTest('../one-color-all'),
    'base, debug': createTest('../one-color-debug'),
    'base, minified': createTest('../one-color')
}).export(module);
