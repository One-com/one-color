var color = require('../');

var expect = require('unexpected').clone();

describe('isLight', function () {
  it('should return true, if the color is light', function () {
    expect(color('black').isLight(), 'to equal', false);
    expect(color('white').isLight(), 'to equal', true);
    expect(color('blue').isLight(), 'to equal', false);
    expect(color('darkgreen').isLight(), 'to equal', false);
    expect(color('pink').isLight(), 'to equal', true);
    expect(color('goldenrod').isLight(), 'to equal', true);
    expect(color('red').isLight(), 'to equal', false);
  });
});
