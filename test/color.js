var expect = require('unexpected');
var color = require('../');
var namedColorSamples = require('./samples');

var spaces = [
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
    },
    {
        name: 'CMYK',
        channels: ['cyan', 'magenta', 'yellow', 'black', 'alpha']
    }
    // {
    //     name: 'XYZ',
    //     channels: ['x', 'y', 'z', 'alpha']
    // },
    // {
    //     name: 'LAB',
    //     channels: ['l', 'a', 'b', 'alpha']
    // }
];


describe('Named colors', function () {
    Object.keys(namedColorSamples).forEach(function (namedColor) {
        var hex = namedColorSamples[namedColor].toLowerCase();
        it('should parse ' + namedColor + ' as ' + hex, function () {
            return expect(color(namedColor).hex(), 'to be', hex);
        });
    });
});

spaces.forEach(function (colorSpace) {
    describe(colorSpace.name, function () {
        var spaceName = colorSpace.name;

        it('should have a constructor function', function () {
            expect(color[spaceName], 'to be a function');
        });

        var clr = colorSpace.name === 'CMYK' ? new color[spaceName](1, 1, 1, 1, 1) : new color[spaceName](0, 0, 0, 1);

        it('should be constructed correctly', function () {
            expect(clr, 'to satisfy', {
                isColor: true
            });
        });

        describe('color space conversion', function () {
            spaces.forEach(function (otherSpace) {

                it('should have a ' + otherSpace.name + ' conversion method', function () {
                    var expected = {};

                    expected[otherSpace.name.toLowerCase()] = expect.it('to be a function');

                    expect(clr, 'to satisfy', expected);
                });

                it('should convert to ' + otherSpace.name, function () {
                    var expected = {
                        isColor: true
                    };

                    otherSpace.channels.forEach(function (channelName) {
                        expected['_' + channelName] = expect.it('to be a number');
                    });

                    expect(clr[otherSpace.name.toLowerCase()](), 'to satisfy', expected);

                    // Awaiting unexpected patch
                    // expect(clr[otherSpace.name.toLowerCase()](), 'to exhaustively satisfy', expected);
                });
            });
        });

        describe('equality', function () {
            it('should have an equals method', function () {
                expect(clr, 'to satisfy', {
                    equals: expect.it('to be a function').and('to have arity', 2)
                });
            });

            spaces.forEach(function (otherSpace) {
                it('should equal same color in ' + otherSpace.name, function () {
                    if (otherSpace.name === 'CMYK') {
                        expect(clr.equals(new color[otherSpace.name](1, 1, 1, 1, 1)), 'to be true');
                    } else {
                        expect(clr.equals(new color[otherSpace.name](0, 0, 0, 1)), 'to be true');
                    }
                });
            });
        });

        it('should convert to JSON', function () {
            var clr = new color[colorSpace.name](Math.random(), Math.random(), Math.random(), Math.random(), Math.random());

            expect(clr.equals(color(clr.toJSON())), 'to be true');
        });

        describe('color channels', function () {
            colorSpace.channels.forEach(function (channel) {
                var shortHand = channel === 'black' ? 'k' : channel.charAt(0);

                describe(channel, function () {
                    it('should have a "' + channel + '" method', function () {
                        var expected = {};

                        expected[channel] = expect.it('to be a function').and('to have arity', 2);

                        expect(clr, 'to satisfy', expected);
                    });

                    it('should have a "' + shortHand + '" shorthand method', function () {
                        var expected = {};

                        expected[shortHand] = expect.it('to be a function').and('to have arity', 2);

                        expect(clr, 'to satisfy', expected);
                    });

                    it('should get the "' + channel + '" value', function () {
                        expect(new color[colorSpace.name](0, 0, 0, 0, 0)[channel](), 'to be', 0);
                    });

                    it('should get the "' + channel + '" shorthand "' + shortHand + '" value', function () {
                        expect(new color[colorSpace.name](0, 0, 0, 0, 0)[channel](), 'to be', 0);
                    });

                    it('should set the "' + channel + '" value', function () {
                        expect(clr[channel](0)[channel](), 'to be', 0);
                        expect(clr[channel](0.5)[channel](), 'to be', 0.5);

                        if (channel === 'hue') {
                            // Hue is considered a circle, and thus has periodic boundary conditions
                            expect(clr[channel](1)[channel](), 'to be', 0);
                            expect(clr[channel](-0.1)[channel](), 'to be', 0.9);
                            expect(clr[channel](1.5)[channel](), 'to be', 0.5);
                        } else {
                            expect(clr[channel](1)[channel](), 'to be', 1);
                            expect(clr[channel](-0.1)[channel](), 'to be', 0);
                            expect(clr[channel](1.1)[channel](), 'to be', 1);
                        }
                    });

                    it('should set the "' + channel + '" shorthand "' + shortHand + '" value', function () {
                        expect(clr[shortHand](0)[channel](), 'to be', 0);
                        expect(clr[shortHand](0.5)[channel](), 'to be', 0.5);

                        if (channel === 'hue') {
                            // Hue is considered a circle, and thus has periodic boundary conditions
                            expect(clr[shortHand](1)[channel](), 'to be', 0);
                            expect(clr[shortHand](-0.1)[channel](), 'to be', 0.9);
                            expect(clr[shortHand](1.5)[channel](), 'to be', 0.5);
                        } else {
                            expect(clr[shortHand](1)[channel](), 'to be', 1);
                            expect(clr[shortHand](-0.1)[channel](), 'to be', 0);
                            expect(clr[shortHand](1.1)[channel](), 'to be', 1);
                        }
                    });

                    it('should adjust the "' + channel + '" value', function () {
                        expect(clr[channel](0)[channel](0.5, true)[channel](), 'to be', 0.5);
                    });

                    it('should adjust the "' + channel + '", shorthand "' + shortHand + '" value', function () {
                        expect(clr[channel](0)[shortHand](0.5, true)[channel](), 'to be', 0.5);
                    });
                });

            });
        });

    });
});
