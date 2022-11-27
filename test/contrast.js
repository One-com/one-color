var color = require('../');

var expect = require('unexpected').clone();

function contrast(color1, color2) {
  var contrast = color(color1).contrast(color(color2));
  return Math.round(contrast * 100) / 100;
}

describe('contrast', function () {
  it('should return the contrast for colors', function () {
    expect(contrast('white', 'black'), 'to equal', 21);
    expect(contrast('white', 'red'), 'to equal', 4);
    expect(contrast('red', 'white'), 'to equal', 4);
    expect(contrast('005aff', 'eeeeee'), 'to equal', 4.63);
    expect(contrast('blue', 'blue'), 'to equal', 1);
  });
});
