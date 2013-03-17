var vows = require('vows'),
    assert = require('assert'),
    namedColorSamples = require('./samples'),
    spaces = [
        'rgb',
        'hsl',
        'hsv'
    ];

function createTest(bundleFileName) {
    var Color = require(bundleFileName),
        batch = {};

    Object.keys(namedColorSamples).forEach(function (namedColor) {
        var sub = batch[namedColor + ': ' + namedColorSamples[namedColor]] = {
            topic: Color(namedColorSamples[namedColor])
        };
        spaces.forEach(function (space) {
            sub[space.toUpperCase() + ' hex string comparison'] = function (topic) {
                assert.equal(topic[space]().hex(), topic.hex());
            };
            /*
            sub[space.toUpperCase() + ' strict comparison'] = function (topic) {
                assert.ok(topic.equals(topic[space]()));
            };*/
        });
    });

    return batch;
}
/*
vows.describe('Color').addBatch({
    'base, debug': createTest('../one-color-debug'),
    'base, minified': createTest('../one-color')
}).export(module);
*/
spaces.push(
    'cmyk',
    'xyz'/*,
    'lab'*/
);

vows.describe('Color-all').addBatch({
    //'all, debug': createTest('../one-color-all-debug'),
    'all, minified': createTest('../one-color-all')
}).export(module);
