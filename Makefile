default: build

SOURCES= \
	src/cppcodegen.ts

TESTS= \
	tests/common.ts \
	tests/declarators.ts \
	tests/parenthesizing.ts

build:
	time tsc $(SOURCES) --sourcemap --out compiled.js

watch:
	tsc $(SOURCES) --sourcemap --out compiled.js -w

test:
	time tsc $(SOURCES) $(TESTS) --sourcemap --out test.js
	mocha
