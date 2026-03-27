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
