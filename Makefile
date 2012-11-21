# Add binaries from NPM modules to PATH
PATH:=node_modules/.bin:${PATH}

jsfiles := $(shell find lib/ -type f -name "*.js")
outputfiles := one-color-debug.js one-color.js one-color-all-debug.js one-color-all.js one-color-ieshim.js

.PHONY : all clean

all: $(outputfiles)

%.js: %-debug.js
	./bin/build.js -o $@ $<

one-color-debug.js: $(jsfiles)
	flattenOneInclude --parentdir lib/color/_base.js > $@

one-color-all-debug.js: $(jsfiles)
	flattenOneInclude --parentdir lib/color/_all.js > $@

one-color-ieshim.js: lib/es5-shim.js
	cat $^ | uglifyjs -nc > $@

clean:
	rm -f $(outputfiles)

# Generate tag, publish and push a new release:
.PHONY: release-%
release-%:
ifneq ($(shell git describe --always --dirty | grep -- -dirty),)
	$(error Working tree is dirty, please commit or stash your changes, then try again)
endif
	@perl -e 'die "Invalid version number syntax: $$ARGV[0]" unless scalar @ARGV == 1 && $$ARGV[0] =~ /^\d+\.\d+\.\d+$$/;' $*
	@if [ '$(shell git show-ref --tags v$*)A' = A ]; then \
		npm install ;\
		$(MAKE) clean ;\
		$(MAKE) $(outputfiles) ;\
		npm test ;\
		git add $(outputfiles) ;\
		perl -pi -e's/"version":\s*"[^"]*"/"version": "'$*'"/g;' *.json ;\
		git add *.json ;\
		git commit -m "Release "$*"." ;\
		git tag v$* ;\
		npm publish ;\
		git push origin `git rev-parse --abbrev-ref HEAD` v$* ;\
	fi
