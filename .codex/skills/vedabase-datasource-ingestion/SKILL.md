---
name: vedabase-datasource-ingestion
description: Use when syncing remote Vedabase corpus data, validating completeness, refreshing cached YouTube search results, and regenerating the app-facing synchronized data module.
---

# Vedabase Datasource Ingestion

Use this skill when the repository needs refreshed remote corpus/search data.

## Scope

Primary responsibilities:

- fetch the remote Vedabase dump immediately when sync is requested
- verify checksum, item count, and structural completeness
- normalize corpus data into repository-owned cache files
- refresh YouTube search result caches for hymn-learning flows
- regenerate app-facing synchronized data artifacts

## Commands

Run these from the repository root:

```bash
npm run data:sync:vedabase -- <remote-url>
npm run data:sync:youtube -- <query> [more queries...]
npm run data:generate
npm run data:verify
```

## Repository Layout

- `data/remote/vedabase-dump/`
- `data/remote/youtube-search/`
- `data/cache/`
- `src/generated/remote-data.ts`

## Rules

1. Fetch first, then verify, then regenerate app-facing data.
2. Preserve provenance beside downloaded artifacts:
   - source URL
   - fetch timestamp
   - checksum
   - byte size
   - item count
3. Fail deterministically when a datasource is incomplete.
4. Keep local app/runtime behavior deterministic even when remote fetch is unavailable.
5. Update tests whenever sync normalization or generated data shapes change.

## Verification

Run at minimum:

```bash
npm run data:verify
npm run test -- --run
npm run build
```

Before commit, escalate to:

```bash
make verify-strict
make act-run
```
