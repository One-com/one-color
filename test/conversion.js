var expect = require('unexpected');
var namedColorSamples = require('./samples');
var color = require('../');
var spaces = ['rgb', 'hsl', 'hsv', 'cmyk'];

describe('conversion', function () {
  Object.keys(namedColorSamples).forEach(function (namedColor) {
    describe('with named color sample ' + namedColor, function () {
      var instance = color(namedColorSamples[namedColor]);
      spaces.forEach(function (space) {
        it('should convert to ' + space, function () {
          expect(instance[space]().hex(), 'to equal', instance.hex());
        });
      });
    });
  });
});
