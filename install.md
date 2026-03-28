# Vedabase Installation Guide

Install Vedabase to study Vedic hymns on desktop/web and to prepare chosen hymn bundles for Nintendo DS homebrew export.

## Fast Setup

- 🖥️ Need Node.js 18+, npm, Git. Нужны Node.js 18+, npm, Git.
- 📦 Clone and install. Клонируйте и установите.

```bash
git clone https://github.com/realagiorganization/vedabase.git
cd vedabase
make install
```

## Run

- ▶️ Start dev server. Запустите dev-сервер.

```bash
make dev
```

- Equivalent npm command. Эквивалентная npm-команда.

```bash
npm run dev
```

## Verify

- 🧪 Tests. Тесты.

```bash
make test
```

- 🧹 Lint. Линтер.

```bash
make lint
```

- 🔤 Typecheck. Проверка типов.

```bash
make typecheck
```

- 🏗️ Production build. Production-сборка.

```bash
make build
```

- 📚 Generate docs artifacts. Сгенерируйте артефакты документации.

```bash
npm run docs:generate
npm run docs:test
```

- 🔮 Predictive verification. Предиктивная проверка.

```bash
make predictive-build-test-all
```

- 🚦 Required pre-commit gate. Обязательный gate перед коммитом.

```bash
make verify-strict
make act-run
```

If warning-mode is explicitly accepted:

```bash
make act-run-yellow
```
