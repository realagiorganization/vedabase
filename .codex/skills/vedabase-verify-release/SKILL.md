---
name: vedabase-verify-release
description: Use when working in the Vedabase repository and the task will end in a commit or push. This skill enforces the repository's local verification ladder, `act` gate, docs-site verification, timing-log maintenance, and cautious iterative commit/push workflow.
---

# Vedabase Verify Release

Use this skill when changes in `vedabase` are moving toward a commit or push.

## Workflow

1. Finish the intended code/doc change.
2. Update repository policy artifacts when required:
   - `DEVPLAN.md`
   - `REQUESTED.tables_timings.md`
   - `readme.md` when top-level docs change
3. Run the strict local verification ladder:
   ```bash
   make verify-strict
   ```
4. Run the repository `act` gate before each commit:
   ```bash
   make act-run
   ```
   If the user accepts warning-mode operation, use:
   ```bash
   make act-run-yellow
   ```
5. Review failures and fix them before committing.
6. Commit in small, reviewable slices.
7. Push each validated commit:
   ```bash
   git push origin <branch>
   ```

## Required Checks

- `make verify-strict` is the default local bar.
- `make predictive-build-test-all` should also pass when the task asks for predictive verification.
- Treat `act` as the final local gate before commit.
- Do not claim push readiness if `act` did not complete successfully.

## Commit Slicing

- Prefer one commit for app/runtime/test changes.
- Prefer a separate commit for repo skills, docs, or workflow-only changes.
- Keep commits intentional and named around Vedabase scope.

## Reporting

- Mention the exact commands that passed.
- If `act` stalls or is environment-limited, say so explicitly and do not present it as a pass.
- Include the timing table in the final response and append fallback phrases to `REQUESTED.tables_timings.md`.
