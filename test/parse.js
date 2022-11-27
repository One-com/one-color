var color = require('../');
var expect = require('unexpected').clone();

expect.addAssertion('<object> to be a color instance', function (
  expect,
  subject
) {
  expect(subject, 'to satisfy', { isColor: true });
});

describe('parsing', function () {
  describe('when parsing cmyk example from https://github.com/One-com/one-color/issues/25', function () {
    expect(
      color('cmyk(1.95468%,3.82086%,5.06294%,11.3802%)'),
      'to be a color instance'
    );
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

  describe('with #rrggbbaa', function () {
    var instance = color('#00ff0080');

    it('should return a color instance', function () {
      expect(instance, 'to be a color instance');
    });

    it('should be green', function () {
      expect(instance.hex(), 'to equal', '#00ff00');
    });

    it('should have its alpha channel set correctly', function () {
      expect(instance.alpha().toFixed(2), 'to equal', '0.50');
    });
  });

  describe('with #rgba', function () {
    var instance = color('#0f08');

    it('should return a color instance', function () {
      expect(instance, 'to be a color instance');
    });

    it('should be green', function () {
      expect(instance.hex(), 'to equal', '#00ff00');
    });

    it('should have its alpha channel set correctly', function () {
      expect(instance.alpha().toFixed(2), 'to equal', '0.53');
    });
  });

  describe('with rgb(r, g, b)', function () {
    var instance = color('rgb(10, 20, 30)');

    it('should return a color instance', function () {
      expect(instance, 'to be a color instance');
    });

    it('should be green', function () {
      expect(instance.hex(), 'to equal', '#0a141e');
    });
  });

  describe('with rgb(r,g,b)', function () {
    var instance = color('rgb(10,20,30)');

    it('should return a color instance', function () {
      expect(instance, 'to be a color instance');
    });

    it('should be green', function () {
      expect(instance.hex(), 'to equal', '#0a141e');
    });
  });

  describe('with rgb(r g b)', function () {
    var instance = color('rgb(10 20 30)');

    it('should return a color instance', function () {
      expect(instance, 'to be a color instance');
    });

    it('should be green', function () {
      expect(instance.hex(), 'to equal', '#0a141e');
    });
  });

  describe('with rgba(r g b / a)', function () {
    var instance = color('rgba(10 20 30 / 50%)');

    it('should return a color instance', function () {
      expect(instance, 'to be a color instance');
    });

    it('should be green', function () {
      expect(instance.hex(), 'to equal', '#0a141e');
    });

    it('should have its alpha channel set correctly', function () {
      expect(instance.alpha().toFixed(2), 'to equal', '0.50');
    });
  });

  describe('with rgba(r g b/a)', function () {
    var instance = color('rgba(10 20 30/50%)');

    it('should return a color instance', function () {
      expect(instance, 'to be a color instance');
    });

    it('should be green', function () {
      expect(instance.hex(), 'to equal', '#0a141e');
    });

    it('should have its alpha channel set correctly', function () {
      expect(instance.alpha().toFixed(2), 'to equal', '0.50');
    });
  });

  describe('with hsl(h s l) and the hue given as a percentage', function () {
    var instance = color('hsl(10% 20% 30%)');

    it('should return a color instance', function () {
      expect(instance, 'to be a color instance');
    });

    it('should be green', function () {
      expect(instance.hex(), 'to equal', '#5c503d');
    });
  });

  describe('with hsl(h s l) and the hue given as an angle', function () {
    var instance = color('hsl(10deg 20% 30%)');

    it('should return a color instance', function () {
      expect(instance, 'to be a color instance');
    });

    it('should be green', function () {
      expect(instance.hex(), 'to equal', '#5c423d');
    });
  });
});
