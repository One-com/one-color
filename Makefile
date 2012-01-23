# Put all 'bin' dirs beneath node_modules into $PATH so that we're using
# the locally installed AssetGraph:
# Ugly 'subst' hack: Check the Make Manual section 8.1 - Function Call Syntax
NPM_BINS := $(subst bin node,bin:node,$(shell if test -d node_modules; then find node_modules/ -name bin -type d; fi))
ifneq ($(NPM_BINS),)
	PATH := ${NPM_BINS}:${PATH}
endif

jsfiles := $(shell find lib/ -type f -name "*.js")
outputfiles := one-color-debug.js one-color.js one-color-all-debug.js one-color-all.js

.PHONY : all clean

all: $(outputfiles)

%.js: %-debug.js
	./bin/build.js $< > $@

one-color-debug.js: $(jsfiles)
	flattenOneInclude lib/one/color/_base.js > $@

one-color-all-debug.js: $(jsfiles)
	flattenOneInclude lib/one/color/_all.js > $@

doc: $(jsfiles)
	mkdir -p doc
	jsdoc.sh --directory=doc/api -a -p lib

clean:
	rm -f $(outputfiles)
	rm -rf doc
