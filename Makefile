# Add binaries from NPM modules to PATH
PATH:=node_modules/.bin:${PATH}

jsfiles := $(shell find lib/ -type f -name "*.js")
outputfiles := one-color-debug.js one-color.js one-color-all-debug.js one-color-all.js one-color-ieshim.js

.PHONY : all clean

all: $(outputfiles)

%.js: %-debug.js
	./bin/build.js $< > $@

one-color-debug.js: $(jsfiles)
	flattenOneInclude --parentdir lib/color/_base.js > $@

one-color-all-debug.js: $(jsfiles)
	flattenOneInclude --parentdir lib/color/_all.js > $@

one-color-ieshim.js: lib/es5-shim.js
	cat $^ | uglifyjs -nc > $@

doc: $(jsfiles)
	mkdir -p doc
	jsdoc.sh --directory=doc/api -a -p lib

clean:
	rm -f $(outputfiles)
	rm -rf doc
