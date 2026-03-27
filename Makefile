.PHONY: install dev build preview test lint lint\:fix act-run act-run-yellow predictive-build-test-all

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

test:
	npm run test

lint:
	npm run lint

lint\:fix:
	npm run lint:fix

act-run:
	act

act-run-yellow:
	@set -e; act || true

predictive-build-test-all:
	npm run lint && npm run test && npm run build
