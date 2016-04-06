var color = require('../');

var expect = require('unexpected').clone();

describe('grayscale', function () {
    it('should convert a non-gray to a shade of gray', function () {
        expect(color('#550022').grayscale().hex(), 'to equal', '#1d1d1d');
    });
});
