# Vedabase Agent Instructions

This file is the canonical instruction source for agents operating in this repository.

## Scope

You are operating inside this repository at `/home/standart/vedabase`.

## Module 1: Repository Policy

- Always include and maintain the top-level docs:
  - `install.md`
  - `readme.md`
  - `AGENTS.md`
- Keep binary/media artifacts out by default.
- Keep the documented product purpose explicit:
  - desktop/web software for learning Vedic hymns
  - export/compile chosen hymn sets into a Nintendo DS homebrew ROM workflow
- Preserve the Vedabase app domain focus:
  - YouTube reciter
  - karaoke viewer
  - Vedic hymns corpus and navigation
  - underword translator
  - generative murti viewer
- Prefer source-controlled, reproducible assets and deterministic configuration.

## Module 2: Local GitHub Actions Gate (Required Before Every Commit)

**CRITICAL**: Before committing any changes, run the full GitHub Actions workflow locally with `act`.

### Stage Workflow

1. Make repository changes.
2. Run local GitHub Actions:
   ```bash
   make act-run
   ```
   OR run with yellow accepted:
   ```bash
   make act-run-yellow
   ```
3. Review test output, lint output, and warnings.
4. Fix failures and unacceptable warnings.
5. Re-run until GREEN or acceptable YELLOW:
   - GREEN: all jobs pass.
   - YELLOW: warnings or allowed failures only.
   - RED: critical failures; do not commit.
6. Commit with a message that references Vedabase scope or the active kata/task slug.

### Exit Codes

| Exit Code | Meaning | Action |
|---|---|---|
| 0 | All jobs passed | Safe to commit |
| 1 | Job failed | Fix and re-run |
| YELLOW (1) | Warnings-only scenario | Review and document acceptance |

### Commands

```bash
make install
make act-run
make act-run-yellow
act -j lint
act -j test
act -W .github/workflows/katas.yml
act -j lint -W .github/workflows/katas.yml
```

### CI Is Source of Truth

- Local `act` should match CI behavior.
- If local passes but CI fails, investigate environment or workflow drift and fix.

## Module 3: `/home` File Inclusion Policy (Only When Requested)

When explicitly requested to add home files, include every dotfile and every non-binary non-large file even if ignored.

- Treat files larger than 100 MB as non-default.
- Trackable MIME classes:
  - `text/*`
  - `application/json`
  - `application/xml`
  - `application/yaml`
  - `application/toml`
  - `application/javascript`

Use this command pattern:

```bash
find /home/standart -type f -size -100M -print0 | \
  while IFS= read -r -d '' file; do
    mime=$(file -b --mime-type "$file")
    case "$mime" in
      text/*|application/json|application/xml|application/yaml|application/toml|application/javascript)
        git add -f "$file"
        ;;
    esac
  done
```

Also force-add hidden files explicitly:

```bash
find /home/standart -type f -name '.*' -print0 | xargs -0 git add -f
```

## Module 4: `README.agents.md` Synchronization Policy

- `README.agents.md` is a derived instruction-citation table from this file.
- Update `README.agents.md` whenever `AGENTS.md` changes.
- Keep entries verbatim with `AGENTS.md` line citations.
- Perform synchronization in the same change set as instruction edits.

## Module 5: DEVPLAN Continuation Policy

- Always write next steps into `DEVPLAN.md`.
- When work is kata-specific, also write next steps into the relevant `DEVPLAN.kata.*.md`.
- If the user says `continue`, execute the next pending DEVPLAN step as the prompt.

## Module 6: Emojiful Timing Table Policy

- Add an emojiful timing table to responses.
- Include timing information for the most recent response.
- When background processes are used, include their timing.
- If telemetry is unavailable, placeholders are allowed.

## Module 7: Commit Policy

- Commit completed repository changes after verification.
- Do not push if local verification gates fail.

## Module 8: `REQUESTED.tables_timings.md` Maintenance Policy

- Maintain `REQUESTED.tables_timings.md`.
- Keep it describing requested timing-logging capability.
- After each response with an emojiful timing table, append entries for each timing output equal to:
  - `tool timing not reported`
  - `no completing timing`
- Preserve exact phrases in the log.
- Treat placeholders as fallback only, not success when real timings are available.

## Module 9: VS Code Relaunch Policy

- After any change to these files:
  - `.vscode/launch.json`
  - `.vscode/tasks.json`
  - `.vscode/settings.json`
  - `.vscode/extensions.json`
- Run before pre-commit gate and before commit:
  ```bash
  make relaunch_vscode
  ```

## Module 10: Remote GH Actions Verification Policy

- Run local GitHub Actions (`make act-run` or `make act-run-yellow`) before any remote push.
- Monitor remote GitHub Actions after push.
- If remote jobs fail, reproduce and fix locally first, validate with `act`, then create corrective commit.

## Module 11: Predictive Build Logging + Auto Push Policy

- During implementation, run `make predictive-build-test-all` (or equivalent with predictive logging).
- Predictive logging must include:
  - timing prediction vs actual timing
  - result prediction vs actual exit code/result
- Before each observed output/result line, write predicted line into `REQUESTED.predict_vs_actual.inline.md`.
- Immediately after prediction, write the actual observed line.
- If prediction differs, insert an inline emoji comment before actual line including both values.
- Keep logs append-only and chronological.
- Keep this workflow available through `make` commands.
- Commit completed work and push with:
  ```bash
  git push origin <branch>
  ```
  only after local verification gates pass.

## Module 12: Todo Summary Table Policy

- When asked to analyze or summarize todos, provide a concise emojiful and linkful markdown table.
- Include source path links, pending/completed counts, and one short next-action snippet per source.
- Keep table deterministic and prioritize top actionable sources.

## Module 13: Source-First Naming Policy

- Prefer source-code-native names and structures over prompt-invented labels.
- For katas/tasks, use slug-first naming for directories, files, tests, and commands.
- If prompt wording conflicts with repository naming, align implementation names to source and map prompt terms in docs only.

## Vedabase Application Engineering Directives

These directives are mandatory for all Vedabase product work.

### Product Features (Primary Scope)

- Desktop/web learning workflow for Vedic hymns.
- YouTube reciter experience for scripture audio/video sessions.
- Karaoke viewer synchronized with verses and transliteration.
- Vedic hymns browsing/searching/reading surface.
- Underword translator for word-level and phrase-level meaning aids.
- Generative murti viewer for devotional visualization workflows.
- Nintendo DS homebrew ROM compilation workflow for user-selected hymns.

### Frontend Stack and Standards

- Framework: React 18.
- Language: TypeScript (strict mode preferred).
- Build tooling: Vite.
- Styling: Tailwind CSS.
- Motion and transitions: Framer Motion.
- Use composable, testable components and typed feature boundaries.

### API Route Requirements

Define and maintain API route groups for:

- Vedabase content access (`/api/vedabase/*`).
- Translator services (`/api/translator/*`).
- Murti generation (`/api/murti/*`).

Design API contracts with explicit request/response schemas and deterministic error shapes.

### Testing Requirements

- Use Vitest as the test runner.
- Use mocks for external APIs and model providers.
- Cover:
  - feature logic for reciter, karaoke sync, hymn rendering, translation flows, murti generation adapters
  - API route behavior for success and failure cases
  - state and data transformation boundaries

### Delivery Constraints

- Keep generated files and workflow changes auditable.
- Avoid unrelated instructions or unrelated platform policies in this repository.
