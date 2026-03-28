---
name: vedabase-feature-contract-delivery
description: Use when extending Vedabase features in the React/Vite app while keeping deterministic frontend contracts. This skill guides feature iteration across hymn, translator, murti, docs, and reciter flows with typed mock-backed API layers, tests, and documentation alignment.
---

# Vedabase Feature Contract Delivery

Use this skill when adding or refining Vedabase product features.

## Scope

Primary surfaces:

- YouTube reciter
- Karaoke hymn viewer
- Underword translator
- Generative murti viewer
- Docs route and generated functionality artifacts

## Delivery Pattern

1. Prefer source-native names and existing routes/components.
2. Extend the typed API layer before adding page behavior:
   - `src/lib/api/contracts.ts`
   - `src/lib/api/http.ts`
   - `src/lib/api/*.ts`
3. Keep deterministic fallback behavior when the backend is not present.
4. Wire page state from the API layer instead of embedding raw placeholder data in pages.
5. Add or update tests for:
   - direct API contract behavior
   - hooks
   - feature pages
   - docs route when docs behavior changes
6. Keep README/install guidance aligned when verification or user-facing routes change.

## Contract Rules

- Canonical route groups should remain explicit:
  - `/api/vedabase/*`
  - `/api/translator/*`
  - `/api/murti/*`
- Request validation should fail deterministically with a typed error shape.
- Prefer shared contract descriptors over duplicated path strings.

## Verification

Run at minimum:

```bash
npm run lint
npm run test -- --run
npm run build
```

Before commit, escalate to:

```bash
make verify-strict
make act-run
```

## Common Next Steps

- Replace typed mocks with real backend handlers without changing the contract layer.
- Increase coverage for currently low-coverage files such as `youtube.ts`, `http.ts`, and `HomePage.tsx`.
- Add route-level success and failure tests whenever a new user-facing feature is introduced.
