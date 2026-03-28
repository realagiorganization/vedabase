# Vedabase Installation Guide

This guide covers local setup for Vedabase.

## Prerequisites

- Node.js 18 or newer
- npm (bundled with Node.js)
- Git

Verify versions:

```bash
node --version
npm --version
```

## Installation Steps

```bash
git clone https://github.com/realagiorganization/vedabase.git
cd vedabase
make install
```

If you prefer direct npm usage:

```bash
npm install
```

## Development Setup

Start the local development server:

```bash
make dev
```

Equivalent npm command:

```bash
npm run dev
```

## Testing Setup

Run unit/integration tests:

```bash
make test
```

Run lint checks:

```bash
make lint
```

Run type checks:

```bash
make typecheck
```

Apply lint fixes automatically:

```bash
make lint:fix
```

Validate local GitHub Actions jobs:

```bash
make act-run
```

If warnings are acceptable for your workflow:

```bash
make act-run-yellow
```

## Build Instructions

Create a production build:

```bash
make build
```

Preview the production build locally:

```bash
make preview
```

Run the consolidated predictive build/test flow:

```bash
make predictive-build-test-all
```

Generate the functionality and BDD documentation artifacts:

```bash
npm run docs:generate
```

Build and verify the GitHub Pages documentation site output:

```bash
npm run docs:test
```

Run the stricter local verification ladder:

```bash
make verify
make verify-strict
```
