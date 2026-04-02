#!/usr/bin/env python3
"""OCR-check DS ROM UI media for expected text and navigation state."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import tempfile
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass
class OcrCheck:
    label: str
    source: str
    text: str
    required_phrases: list[str]


def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9:/\\-]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def preprocess_image(input_path: Path, output_path: Path, convert_bin: str) -> None:
    convert_path = shutil.which(convert_bin)
    if convert_path is None:
        shutil.copyfile(input_path, output_path)
        return

    subprocess.run(
        [
            convert_path,
            str(input_path),
            "-colorspace",
            "Gray",
            "-resize",
            "300%",
            "-threshold",
            "60%",
            str(output_path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )


def run_tesseract(tesseract_bin: str, image_path: Path) -> str:
    result = subprocess.run(
        [tesseract_bin, str(image_path), "stdout", "--psm", "6"],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def extract_video_frame(ffmpeg_bin: str, input_path: Path, seconds: float, output_path: Path) -> None:
    subprocess.run(
        [
            ffmpeg_bin,
            "-y",
            "-ss",
            f"{seconds}",
            "-i",
            str(input_path),
            "-frames:v",
            "1",
            str(output_path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )


def require_phrases(label: str, text: str, phrases: list[str]) -> None:
    normalized_text = normalize(text)
    missing = [phrase for phrase in phrases if normalize(phrase) not in normalized_text]
    if missing:
      raise SystemExit(f"{label} OCR missing phrases: {', '.join(missing)}\nOCR text: {text}")


def build_checks(media_dir: Path, ffmpeg_bin: str, tesseract_bin: str, convert_bin: str) -> list[OcrCheck]:
    checks: list[OcrCheck] = []
    with tempfile.TemporaryDirectory() as temp_dir_raw:
        temp_dir = Path(temp_dir_raw)

        sources = {
            "initial": media_dir / "ui-initial.png",
            "after_right": media_dir / "ui-after-right.png",
            "after_down": media_dir / "ui-after-down.png",
        }
        video_path = media_dir / "ui-navigation.mp4"
        if video_path.exists():
            video_frame = temp_dir / "ui-video-mid.png"
            extract_video_frame(ffmpeg_bin, video_path, 4.0, video_frame)
            sources["video_mid"] = video_frame

        requirements = {
            "initial": ["Vedabase Favorites", "Use Left/Right for hymn", "Use Up/Down for language"],
            "after_right": ["Vedabase Favorites", "Gurv-astaka Refrain"],
            "after_down": ["Vedabase Favorites", "Lang:", "Sri Gurvastakam"],
            "video_mid": ["Vedabase Favorites", "Use Left/Right for hymn"],
        }

        for label, source in sources.items():
            if not source.exists():
                raise SystemExit(f"missing OCR source image: {source}")
            prepared = temp_dir / f"{label}-prepared.png"
            preprocess_image(source, prepared, convert_bin)
            text = run_tesseract(tesseract_bin, prepared)
            checks.append(
                OcrCheck(
                    label=label,
                    source=str(source),
                    text=text.strip(),
                    required_phrases=requirements[label],
                )
            )
    return checks


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--media-dir", type=Path, required=True)
    parser.add_argument("--output-json", type=Path)
    parser.add_argument("--ffmpeg-bin", default="ffmpeg")
    parser.add_argument("--tesseract-bin", default="tesseract")
    parser.add_argument("--convert-bin", default="convert")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    checks = build_checks(args.media_dir, args.ffmpeg_bin, args.tesseract_bin, args.convert_bin)
    for check in checks:
        require_phrases(check.label, check.text, check.required_phrases)

    if args.output_json:
        args.output_json.write_text(
            json.dumps({"checks": [asdict(check) for check in checks]}, indent=2) + "\n",
            encoding="utf-8",
        )

    print("OCR media verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
