jsfiles := $(shell find lib/ -type f -name "*.js")
outputfiles := one-color-debug.js one-color.js

.PHONY : all clean

all: $(outputfiles)

one-color-debug.js: $(jsfiles)
	flattenOneInclude lib/one/color/_all.js --label js=lib > $@

one-color.js: one-color-debug.js
	yui-compressor --type js $< > $@

clean:
	rm -f $(outputfiles)
