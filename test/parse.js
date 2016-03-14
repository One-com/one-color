var color = require('../');
var expect = require('unexpected').clone();

expect.addAssertion('<object> to be a color instance', function (expect, subject) {
    expect(subject, 'to satisfy', { isColor: true });
});


describe('parsing', function () {
    describe('when parsing cmyk example from https://github.com/One-com/one-color/issues/25', function () {
        expect(color('cmyk(1.95468%,3.82086%,5.06294%,11.3802%)'), 'to be a color instance');
    });

    describe('when parsing white cmyk', function () {
        var instance = color('cmyk(0%,0%,0%,0%)');

        it('should return a color instance', function () {
            expect(instance, 'to be a color instance');
        });

        it('should be white', function () {
            expect(instance.hex(), 'to equal', '#ffffff');
        });
    });

    describe('when parsing black cmyk', function () {
        var instance = color('cmyk(100%,100%,100%,100%)');

        it('should return a color instance', function () {
            expect(instance, 'to be a color instance');
        });

        it('should be black', function () {
            expect(instance.hex(), 'to equal', '#000000');
        });
    });

    describe('with invalid strings', function () {
        it('should refuse a percentage > 100', function () {
            expect(color('cmyk(100.1%,100%,100%,100%)'), 'to be false');
        });

        it('should refuse to parse a non-percentage', function () {
            expect(color('cmyk(100,100%,100%,100%)'), 'to be false');
        });

        it('should refuse to parse less than 4 channels', function () {
            expect(color('cmyk(100,100%,100%)'), 'to be false');
        });
    });
});
