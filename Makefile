AVA = ./node_modules/ava/cli.js
NYC = ./node_modules/nyc/bin/nyc.js

all: test

install:
	@npm install

test: install
	@NODE_ENV='testing' $(AVA)

cover: install
	@NODE_ENV='testing' $(NYC) $(AVA)

lint: install
	@eslint src --cache
