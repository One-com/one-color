var color = require('../');

var expect = require('unexpected').clone();

describe('luminance', function () {
    it('should return the luminance for colors', function () {
        expect(color('white').luminance(), 'to equal', 1);
        expect(color('black').luminance(), 'to equal', 0);
        expect(color('ff0000').luminance(), 'to equal', 0.2126);
        expect(color('00ff00').luminance(), 'to equal', 0.7152);
        expect(color('0000ff').luminance(), 'to equal', 0.0722);
    });
});
