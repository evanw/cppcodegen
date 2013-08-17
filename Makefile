default: build

SOURCES= \
	src/cppcodegen.ts

TESTS= \
	tests/common.ts \
	tests/parenthesizing.ts \
	tests/types.ts

build:
	time node_modules/typescript/bin/tsc $(SOURCES) --sourcemap --out cppcodegen.js

watch:
	node_modules/typescript/bin/tsc $(SOURCES) --sourcemap --out cppcodegen.js -w

test:
	time node_modules/typescript/bin/tsc $(SOURCES) $(TESTS) --sourcemap --out test.js
	node_modules/mocha/bin/mocha
