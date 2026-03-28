# Vedabase

[![CI / Tests](https://github.com/realagiorganization/vedabase/actions/workflows/ci.yml/badge.svg)](https://github.com/realagiorganization/vedabase/actions/workflows/ci.yml)
[![Pages](https://github.com/realagiorganization/vedabase/actions/workflows/pages.yml/badge.svg)](https://github.com/realagiorganization/vedabase/actions/workflows/pages.yml)
[![GitHub Pages](https://img.shields.io/website?url=https%3A%2F%2Frealagiorganization.github.io%2Fvedabase%2Fdocs&label=docs%20site)](https://realagiorganization.github.io/vedabase/docs)
[![React 18](https://img.shields.io/badge/react-18-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-strict-3178c6)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-5-646cff)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

Vedabase - YouTube reciter, karaoke viewer for Vedic hymns with underword translator and generative murti viewer.

Repository: https://github.com/realagiorganization/vedabase

## Features

- 🎵 YouTube reciter playback for guided chanting sessions
- 🎤 Karaoke-style synchronized hymn display for live recitation
- 🕉️ Underword translator for line-by-line and word-level understanding
- 🛕 Generative murti viewer for immersive devotional visualization
- 🌐 API-driven content delivery for hymns, metadata, and translations

## Architecture Overview

Vedabase is organized as a modern frontend application with API routes and supporting service modules:

- React frontend: renders the karaoke viewer, reciter controls, translator, and murti experience
- API routes: provide endpoints for hymns, verse timing, translation payloads, and media metadata
- Services layer: encapsulates integrations, business logic, and reusable data-processing utilities

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## Quick Start

```bash
git clone https://github.com/realagiorganization/vedabase.git
cd vedabase
make install
make dev
```

The app starts in development mode with hot reload.

## Verification

Run the local verification ladder before commit or push:

```bash
make lint
make typecheck
make test
make build
make verify
make verify-strict
make act-run
```

- `make verify` runs lint, typecheck, tests, and production build.
- `make verify-strict` runs lint, typecheck, coverage tests, and docs-site verification.
- `make predictive-build-test-all` now uses the stricter verification path.

## Documentation Site

Vedabase now includes an auto-generated documentation site at `/docs`.

- Source definitions live in `src/docs/catalog.json`.
- Generated artifacts are produced by `npm run docs:generate`.
- The site build and static docs artifacts are verified by `npm run docs:test`.
- GitHub Pages deploys the generated docs site through `.github/workflows/pages.yml`.

## Contributing

1. Fork the repository and create a feature branch.
2. Install dependencies with `make install`.
3. Run local checks with `make verify-strict` and then `make act-run`.
4. Open a pull request with a clear description and focused scope.

## License

MIT
