# Contributing to Vedabase

Thank you for your interest in contributing to Vedabase!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/vedabase.git`
3. Install dependencies: `make install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

```bash
# Start development server
make dev

# Run tests
make test

# Run linting
make lint

# Build for production
make build
```

## Local CI Verification

Before committing, run the local GitHub Actions:

```bash
make act-run
```

Or with warnings accepted:

```bash
make act-run-yellow
```

## Pull Request Process

1. Ensure all tests pass and linting is clean
2. Update documentation if needed
3. The PR will be reviewed by maintainers
4. Once approved, it will be merged

## Code Style

- Use TypeScript strict mode
- Follow existing component patterns
- Add tests for new features
- Keep components small and focused

## Reporting Issues

Use GitHub Issues to report bugs or feature requests.
