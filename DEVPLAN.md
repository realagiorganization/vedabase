# DEVPLAN

## Completed Foundation

- Done: wire the router to actual feature pages for hymn, translator, and murti flows.
- Done: replace UI scaffolds with typed data flows backed by real or mocked API contracts.
- Done: add an aligned frontend contract layer for `/api/vedabase/*`, `/api/translator/*`, and `/api/murti/*`.
- Done: fix TypeScript and import-path inconsistencies so lint, test, and build can run cleanly.
- Done: expand tests to cover the real components and hooks instead of local inline stand-ins.
- Done: align top-level documentation names and contents, including adding and maintaining `readme.md`.
- Done: add a generated source-of-truth catalog for Vedabase functionality, user actions, and BDD scenarios.
- Done: render generated functionality and BDD content into the Vite docs route with Mermaid diagrams.
- Done: verify docs artifacts in CI and GitHub Pages workflow steps.
- Done: rewrite top-level docs with bilingual product framing, pseudographic screenshots, and Nintendo DS export purpose.
- Done: enable GitHub Pages deployment and direct docs route entry output.
- Done: add a standalone Dockerized Nintendo DS hymn ROM subproject with its own Makefile, mocked JSON catalog, and dedicated CI workflow.

## Next Steps

### 1. Codex Repository Skills Extension

- [x] Add a new Vedabase skill for remote datasource ingestion with explicit workflows for fetch, refresh, checksum verification, and cache invalidation.
- [x] Extend the repository command surface so feature work can depend on synchronized remote hymn/search data without bypassing typed contracts.
- [x] Document repo-native commands for datasource sync, completeness verification, and YouTube search refresh in the skill instructions and package/make targets.
- [x] Define a stable local storage convention for fetched assets and metadata:
  - `data/remote/vedabase-dump/`
  - `data/remote/youtube-search/`
  - `data/cache/`

### 2. Vedabase Dump Fetch Pipeline

- [x] Add a repository-owned fetch command for the remote Vedabase dump that always pulls immediately when the sync workflow is invoked.
- [x] Implement resumable download behavior so partial or interrupted fetches can continue instead of restarting blindly.
- [x] Store provenance beside the fetched dump:
  - source URL
  - fetch timestamp
  - checksum
  - byte size
  - record count if derivable
- [x] Add a completeness verifier that fails if the dump is truncated, malformed, or structurally incomplete.
- [x] Add deterministic normalization/parsing into a typed local index the app can query without hitting the network on every request.

### 3. Remote Search + Fetch API Surface

- [x] Add explicit typed route groups for remote datasource operations, currently under `/api/vedabase/hymns/search`, `/api/vedabase/sync/status`, and `/api/youtube/search`.
- [ ] Define request/response schemas for:
  - fetch remote dump
  - inspect sync status
  - run text search across the synchronized dump
  - return completeness diagnostics
- [x] Keep success/failure shapes deterministic so frontend pages and Codex skills can depend on them safely.
- [x] Preserve synchronized local fallback behavior when the remote datasource is unavailable.

### 4. YouTube Search Integration

- [x] Add a repository-owned YouTube search ingestion workflow that can fetch search results for hymns, reciters, and chant variants on demand.
- [x] Normalize search results into a typed local index keyed by query, channel, video ID, and fetch timestamp.
- [x] Add result quality filters for obvious noise:
  - duplicate video IDs
  - non-hymn matches
  - missing metadata
  - short or broken results
- [x] Expose deterministic app/API access to cached YouTube search results instead of embedding raw remote calls in UI code.
- [x] Add tests around query normalization, deduplication, fallback behavior, and error handling in the sync and API helpers.

### 5. Completeness + Freshness Guarantees

- [x] Add a repo command that verifies remote datasource completeness before app builds or release flows that depend on it.
- [ ] Distinguish:
  - stale but complete
  - fresh and complete
  - incomplete
  - fetch failed
- [x] Write machine-readable sync reports that the app and Codex skills can consume.
- [ ] Add generated docs sections showing current datasource status, last fetch time, and known gaps.

### 6. App Integration

- [x] Add a search-first hymn discovery flow backed by the synchronized Vedabase dump instead of only local mock hymn cards.
- [x] Add UI states for remote sync progress, stale data warnings, completeness failures, and last-success metadata.
- [x] Connect YouTube search suggestions to reciter workflows so users can move from hymn search to playable recitation search cleanly.
- [ ] Prepare the Nintendo DS export flow to consume synchronized hymn selections from the remote corpus rather than static demo data.

### 7. Verification + Release Discipline

- [x] Add tests for remote sync commands, checksum validation, completeness failures, and typed API surfaces.
- [ ] Add docs-site coverage for remote datasource behavior and operational expectations.
- [ ] Extend local verification so datasource-related builds can validate indexed data integrity without requiring live network access in every test.
- [ ] Keep `make verify-strict`, `make predictive-build-test-all`, and the release workflow aligned with the new datasource commands.

### 8. Immediate Execution Order

- [x] Create the new datasource-ingestion Codex skill and document its command contract.
- [x] Scaffold `data/remote/` and typed sync metadata files.
- [x] Implement Vedabase dump fetch + checksum + completeness verification.
- [x] Implement resumable Vedabase dump download support.
- [x] Implement YouTube search fetch + normalization + caching.
- [x] Expose typed `/api/vedabase/sync/*` and search routes.
- [x] Replace mock-first search UI with synchronized corpus search.

### 9. DS Hymn ROM Follow-Up

- [x] Add executable BDD counterparts for the mocked Nintendo DS hymn catalog scenarios.
- [x] Expand the DS subproject from generator-only checks into ROM behavior coverage for paging and language switching.
- [x] Add an emulator-friendly ROM smoke-test path to the DS subproject CI with melonDS capture and README-linked media publication.
- [ ] Verify the new melonDS lane under `act` once Docker image pulls complete reliably in the local environment.
