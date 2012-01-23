#!/usr/bin/env node

var AssetGraph = require('assetgraph'),
    commandLineOptions = require('optimist')
        .demand(1)
        .argv;

new AssetGraph()
    .loadAssets(commandLineOptions._)
    .pullGlobalsIntoVariables({type: 'JavaScript'}, undefined, true)
    .compressJavaScript()
    .queue(function (assetGraph) {
        console.log(assetGraph.findAssets()[0].text);
    })
    .run();

