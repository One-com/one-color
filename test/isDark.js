var color = require('../');

var expect = require('unexpected').clone();

describe('isDark', function () {
  it('should return true, if the color is dark', function () {
    expect(color('black').isDark(), 'to equal', true);
    expect(color('white').isDark(), 'to equal', false);
    expect(color('blue').isDark(), 'to equal', true);
    expect(color('darkgreen').isDark(), 'to equal', true);
    expect(color('pink').isDark(), 'to equal', false);
    expect(color('goldenrod').isDark(), 'to equal', false);
    expect(color('red').isDark(), 'to equal', true);
  });
});
