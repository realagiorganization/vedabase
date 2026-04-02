---
name: vedabase-ds-rom-ocr-verifier
description: Verify DS hymn ROM emulator screenshots and movie captures with OCR-backed checks before README/media publication.
---

# Vedabase DS ROM OCR Verifier

Use this skill when DS hymn ROM emulator media has been captured and you need to
prove the UI still shows the expected title and navigation instructions.

## Workflow

1. Ensure emulator media exists under:
   - `subprojects/ds-hymn-rom/artifacts/emulator-media/`
2. Run the OCR verifier:
   ```bash
   python3 subprojects/ds-hymn-rom/scripts/ocr-ui-media.py \
     --media-dir subprojects/ds-hymn-rom/artifacts/emulator-media \
     --output-json subprojects/ds-hymn-rom/artifacts/emulator-media/ocr-report.json
   ```
3. Confirm the report contains checks for:
   - `ui-initial.png`
   - `ui-after-right.png`
   - `ui-after-down.png`
   - a sampled frame from `ui-navigation.mp4`
4. If OCR fails, inspect the generated media and adjust the emulator capture or UI contract.

## Test Surface

```bash
python3 -m unittest subprojects/ds-hymn-rom/tests/ocr-ui-media.test.py
```
