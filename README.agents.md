# README.agents

This file is the derived instruction-citation table for `AGENTS.md`.

| Module | Instruction (verbatim summary) | Source Citation |
|---|---|---|
| Scope | You are operating inside this repository at `/home/standart/vedabase`. | `AGENTS.md:5` |
| 1. Repository Policy | Always include and maintain `install.md`, `readme.md`, and `AGENTS.md`; keep binary/media artifacts out; keep the product purpose explicit as desktop/web hymn learning plus Nintendo DS homebrew ROM export; preserve Vedabase domain focus. | `AGENTS.md:9` |
| 2. Local GitHub Actions Gate | Before committing, run local `act` verification (`make act-run` or `make act-run-yellow`) and commit only after acceptable GREEN/YELLOW results. | `AGENTS.md:27` |
| 3. `/home` File Inclusion Policy | Only when requested, include `/home` dotfiles and non-binary files under 100 MB using forced add patterns. | `AGENTS.md:75` |
| 4. `README.agents.md` Sync Policy | Update this file whenever `AGENTS.md` changes, keep entries verbatim, and include line citations in same change set. | `AGENTS.md:108` |
| 5. DEVPLAN Continuation Policy | Always write next steps to `DEVPLAN.md`; for kata work also update `DEVPLAN.kata.*.md`; treat `continue` as execute-next-step. | `AGENTS.md:115` |
| 6. Emojiful Timing Table Policy | Add an emojiful timing table to responses, including background process timing when used. | `AGENTS.md:121` |
| 7. Commit Policy | Commit completed changes after verification and do not push when local gates fail. | `AGENTS.md:128` |
| 8. `REQUESTED.tables_timings.md` Maintenance | Maintain timing-log docs and append exact placeholder timing phrases when they occur. | `AGENTS.md:133` |
| 9. VS Code Relaunch Policy | After changing VS Code workspace config files, run `make relaunch_vscode` before gate/commit. | `AGENTS.md:143` |
| 10. Remote GH Actions Verification Policy | Run local `act` before push and monitor remote Actions; fix failures locally first. | `AGENTS.md:155` |
| 11. Predictive Build Logging + Auto Push | Run predictive build logging, append predicted vs actual lines chronologically, and push only after local verification. | `AGENTS.md:161` |
| 12. Todo Summary Table Policy | When asked for todo analysis, provide concise emojiful/linkful markdown table with counts and next action. | `AGENTS.md:178` |
| 13. Source-First Naming Policy | Prefer source-native naming and slug-first conventions; map prompt wording only in docs when needed. | `AGENTS.md:184` |
| Vedabase Product Directives | Enforce feature scope (desktop/web hymn learning, reciter, karaoke, hymns, translator, murti, Nintendo DS ROM export), React 18 + TS + Vite + Tailwind + Framer, API groups, and Vitest with mocks. | `AGENTS.md:190` |
