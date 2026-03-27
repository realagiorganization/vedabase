# Vedabase

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

## Contributing

1. Fork the repository and create a feature branch.
2. Install dependencies with `make install`.
3. Run local checks with `make lint`, `make test`, and `make build`.
4. Open a pull request with a clear description and focused scope.

## License

MIT
