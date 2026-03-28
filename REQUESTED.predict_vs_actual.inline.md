# REQUESTED.predict_vs_actual.inline

2026-03-27 prediction: `make predictive-build-test-all` will fail before meaningful source validation because the local dependency tree is incomplete.
2026-03-27 actual: `make predictive-build-test-all` failed in the lint phase because ESLint could not resolve `concat-map`.
2026-03-27 prediction: `node scripts/generate-docs.mjs` will succeed and emit both the generated TypeScript payload and markdown artifact.
2026-03-27 actual: `node scripts/generate-docs.mjs` succeeded and emitted `src/generated/docs-content.ts` plus `public/generated/functionality-bdd.md`.
2026-03-27 prediction: `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` will fail because Vitest and the coverage plugin are on incompatible major versions.
2026-03-27 actual: `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` failed with an `ERESOLVE` peer dependency conflict between `vitest@2.1.9` and `@vitest/coverage-v8@1.6.1`.
2026-03-27 prediction: after aligning the coverage plugin to the Vitest 2.x line, `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` will complete and create `package-lock.json`.
2026-03-27 actual: after alignment, `npm install --package-lock-only --ignore-scripts --no-audit --no-fund` succeeded and created `package-lock.json`.
2026-03-27 prediction: `make predictive-build-test-all` will hang in the test phase because the Makefile still uses Vitest watch mode.
2026-03-27 actual: `make predictive-build-test-all` reached `npm run test`, passed the tests, and then waited for file changes instead of completing.
2026-03-27 prediction: after switching the predictive target to `npm run test:ci`, `make predictive-build-test-all` will complete and validate lint, tests, and build.
