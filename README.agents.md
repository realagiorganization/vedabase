# README.agents

This file is the derived instruction-citation table for `AGENTS.md`.

| Module | Instruction (verbatim summary) | Source Citation |
|---|---|---|
| Scope | You are operating inside this repository at `/home/standart/vedabase`. | `AGENTS.md:5` |
| 1. Repository Policy | Always include and maintain `install.md`, `readme.md`, and `AGENTS.md`; keep binary/media artifacts out; preserve Vedabase domain focus. | `AGENTS.md:9` |
| 2. Local GitHub Actions Gate | Before committing, run local `act` verification (`make act-run` or `make act-run-yellow`) and commit only after acceptable GREEN/YELLOW results. | `AGENTS.md:24` |
| 3. `/home` File Inclusion Policy | Only when requested, include `/home` dotfiles and non-binary files under 100 MB using forced add patterns. | `AGENTS.md:72` |
| 4. `README.agents.md` Sync Policy | Update this file whenever `AGENTS.md` changes, keep entries verbatim, and include line citations in same change set. | `AGENTS.md:105` |
| 5. DEVPLAN Continuation Policy | Always write next steps to `DEVPLAN.md`; for kata work also update `DEVPLAN.kata.*.md`; treat `continue` as execute-next-step. | `AGENTS.md:112` |
| 6. Emojiful Timing Table Policy | Add an emojiful timing table to responses, including background process timing when used. | `AGENTS.md:118` |
| 7. Commit Policy | Commit completed changes after verification and do not push when local gates fail. | `AGENTS.md:125` |
| 8. `REQUESTED.tables_timings.md` Maintenance | Maintain timing-log docs and append exact placeholder timing phrases when they occur. | `AGENTS.md:130` |
| 9. VS Code Relaunch Policy | After changing VS Code workspace config files, run `make relaunch_vscode` before gate/commit. | `AGENTS.md:140` |
| 10. Remote GH Actions Verification Policy | Run local `act` before push and monitor remote Actions; fix failures locally first. | `AGENTS.md:152` |
| 11. Predictive Build Logging + Auto Push | Run predictive build logging, append predicted vs actual lines chronologically, and push only after local verification. | `AGENTS.md:158` |
| 12. Todo Summary Table Policy | When asked for todo analysis, provide concise emojiful/linkful markdown table with counts and next action. | `AGENTS.md:175` |
| 13. Source-First Naming Policy | Prefer source-native naming and slug-first conventions; map prompt wording only in docs when needed. | `AGENTS.md:181` |
| Vedabase Product Directives | Enforce feature scope (reciter, karaoke, hymns, translator, murti), React 18 + TS + Vite + Tailwind + Framer, API groups, and Vitest with mocks. | `AGENTS.md:187` |
