.PHONY: install dev build preview test lint lint\:fix typecheck verify verify-strict docs-test act-run act-run-yellow predictive-build-test-all data-sync-vedabase data-sync-youtube data-generate data-verify

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

typecheck:
	npm run typecheck

lint\:fix:
	npm run lint:fix

verify:
	npm run verify

verify-strict:
	npm run verify:strict

docs-test:
	npm run docs:test

data-sync-vedabase:
	npm run data:sync:vedabase

data-sync-youtube:
	npm run data:sync:youtube

data-generate:
	npm run data:generate

data-verify:
	npm run data:verify

act-run:
	act

act-run-yellow:
	@set -e; act || true

predictive-build-test-all:
	npm run verify:strict
