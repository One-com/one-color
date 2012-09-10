#!/usr/bin/env node

var fs = require('fs'),
    AssetGraph = require('assetgraph'),
    commandLineOptions = require('optimist')
        .demand(1)
        .argv;

new AssetGraph()
    .loadAssets(commandLineOptions._)
    .pullGlobalsIntoVariables({type: 'JavaScript'}, {wrapInFunction: true})
    .compressJavaScript()
    .queue(function (assetGraph) {
        var text = assetGraph.findAssets()[0].text + "\n";
        if (commandLineOptions.o) {
            fs.writeFile(commandLineOptions.o, text, 'utf-8', function (err) {
                if (err) {
                    throw err;
                }
            });
        } else {
            console.log(text);
        }
    })
    .run(function (err) {
        if (err) {
            throw err;
        }
    });
