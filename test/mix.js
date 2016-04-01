var color = require('../');

var expect = require('unexpected').clone();

describe('mix', function () {
    it('black and white 50% mix should be gray', function () {
        expect(color('white').mix('black').hex(), 'to equal', '#808080');
    });
});
