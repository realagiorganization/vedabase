from __future__ import annotations

import json
import subprocess
import tempfile
import unittest
from pathlib import Path

from PIL import Image


SCRIPT = Path("/home/standart/vedabase/subprojects/ds-hymn-rom/scripts/ocr-ui-media.py")


class OcrUiMediaTests(unittest.TestCase):
    def _write_fake_tesseract(self, path: Path) -> None:
        path.write_text(
            "\n".join(
                [
                    "#!/usr/bin/env python3",
                    "import os, sys",
                    "name = os.path.basename(sys.argv[1])",
                    "texts = {",
                    "  'initial-prepared.png': 'Vedabase Favorites\\nUse Left/Right for hymn\\nUse Up/Down for language',",
                    "  'after_right-prepared.png': 'Vedabase Favorites\\nGurv-astaka Refrain\\nLang: en',",
                    "  'after_down-prepared.png': 'Vedabase Favorites\\nSri Gurvastakam\\nLang: ru',",
                    "  'video_mid-prepared.png': 'Vedabase Favorites\\nUse Left/Right for hymn',",
                    "}",
                    "print(texts.get(name, 'unknown'))",
                ]
            )
            + "\n",
            encoding="utf-8",
        )
        path.chmod(0o755)

    def _write_fake_ffmpeg(self, path: Path) -> None:
        path.write_text(
            "\n".join(
                [
                    "#!/usr/bin/env python3",
                    "import shutil, sys",
                    "input_path = sys.argv[sys.argv.index('-i') + 1]",
                    "output_path = sys.argv[-1]",
                    "shutil.copyfile(input_path.replace('ui-navigation.mp4', 'ui-after-right.png'), output_path)",
                ]
            )
            + "\n",
            encoding="utf-8",
        )
        path.chmod(0o755)

    def test_ocr_media_script_writes_report(self) -> None:
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            media = root / "media"
            media.mkdir()
            for name in ("ui-initial.png", "ui-after-right.png", "ui-after-down.png"):
                Image.new("RGB", (32, 32), "white").save(media / name)
            (media / "ui-navigation.mp4").write_bytes(b"fake-video")

            fake_tesseract = root / "fake-tesseract"
            fake_ffmpeg = root / "fake-ffmpeg"
            self._write_fake_tesseract(fake_tesseract)
            self._write_fake_ffmpeg(fake_ffmpeg)

            report = root / "ocr-report.json"
            subprocess.run(
                [
                    "python3",
                    str(SCRIPT),
                    "--media-dir",
                    str(media),
                    "--output-json",
                    str(report),
                    "--ffmpeg-bin",
                    str(fake_ffmpeg),
                    "--tesseract-bin",
                    str(fake_tesseract),
                ],
                check=True,
                cwd="/home/standart/vedabase/subprojects/ds-hymn-rom",
            )

            payload = json.loads(report.read_text(encoding="utf-8"))
            labels = [entry["label"] for entry in payload["checks"]]
            self.assertEqual(labels, ["initial", "after_right", "after_down", "video_mid"])


if __name__ == "__main__":
    unittest.main()
