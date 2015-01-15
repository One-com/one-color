var vows = require('vows'),
    assert = require('assert'),
    color = require('../one-color-all-debug');



vows.describe('Parsing').addBatch({
    'when parsing cmyk example from https://github.com/One-com/one-color/issues/25': {
        topic: color('cmyk(1.95468%,3.82086%,5.06294%,11.3802%)'),

        'should not return false': function (result) {
            assert(result !== false);
        },

        'should return an object': function (result) {
            assert.isObject(result);
            assert.isTrue(result.isColor);
        },

        'should have a true `isColor` property': function (result) {
            assert.isTrue(result.isColor);
        }
    },

    'when parsing white cmyk': {
        topic: color('cmyk(0%,0%,0%,0%)'),

        'should not return false': function (result) {
            assert(result !== false);
        },

        'should return an object': function (result) {
            assert.isObject(result);
            assert.isTrue(result.isColor);
        },

        'should have a true `isColor` property': function (result) {
            assert.isTrue(result.isColor);
        },

        'should be black': function (result) {
            assert(result.equals(color('white')));
        }
    },

    'when parsing black cmyk': {
        topic: color('cmyk(100%,100%,100%,100%)'),

        'should not return false': function (result) {
            assert(result !== false);
        },

        'should return an object': function (result) {
            assert.isObject(result);
            assert.isTrue(result.isColor);
        },

        'should have a true `isColor` property': function (result) {
            assert.isTrue(result.isColor);
        },

        'should be white': function (result) {
            assert(result.equals(color('black')));
        }
    },

    'when getting an invalid string 1': {
        topic: color('cmyk(100.1%,100%,100%,100%)'),

        'should return false': function (result) {
            assert.isFalse(result);
        }
    },

    'when getting an invalid string 2': {
        topic: color('cmyk(100,100%,100%,100%)'),

        'should return false': function (result) {
            assert.isFalse(result);
        }
    },

    'when getting an invalid string 3': {
        topic: color('cmyk(100,100%,100%)'),

        'should return false': function (result) {
            assert.isFalse(result);
        }
    },

    'when getting an invalid string 4': {
        topic: color('cmyk(1000%,100%,100%,100%)'),

        'should return false': function (result) {
            assert.isFalse(result);
        }
    }
}).export(module);
