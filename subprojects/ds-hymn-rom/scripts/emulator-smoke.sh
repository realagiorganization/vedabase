#!/usr/bin/env bash

set -euo pipefail

: "${EMULATOR_BIN:?EMULATOR_BIN is required}"
: "${ROM_PATH:?ROM_PATH is required}"
: "${OUT_DIR:?OUT_DIR is required}"

DISPLAY_ID="${DISPLAY_ID:-:99}"
SCREEN_SIZE="${SCREEN_SIZE:-1280x720x24}"
HOME_DIR="$(mktemp -d)"
FFMPEG_PID=""
EMU_PID=""
XVFB_PID=""

cleanup() {
  if [[ -n "$FFMPEG_PID" ]] && kill -0 "$FFMPEG_PID" 2>/dev/null; then
    kill -INT "$FFMPEG_PID" 2>/dev/null || true
    wait "$FFMPEG_PID" 2>/dev/null || true
  fi
  if [[ -n "$EMU_PID" ]] && kill -0 "$EMU_PID" 2>/dev/null; then
    kill "$EMU_PID" 2>/dev/null || true
    wait "$EMU_PID" 2>/dev/null || true
  fi
  if [[ -n "$XVFB_PID" ]] && kill -0 "$XVFB_PID" 2>/dev/null; then
    kill "$XVFB_PID" 2>/dev/null || true
    wait "$XVFB_PID" 2>/dev/null || true
  fi
  rm -rf "$HOME_DIR"
}

trap cleanup EXIT

mkdir -p "$OUT_DIR"

Xvfb "$DISPLAY_ID" -screen 0 "$SCREEN_SIZE" >"$OUT_DIR/xvfb.log" 2>&1 &
XVFB_PID="$!"
sleep 2

export DISPLAY="$DISPLAY_ID"
export HOME="$HOME_DIR"
export SDL_AUDIODRIVER=dummy
export QT_QPA_PLATFORM=xcb

"$EMULATOR_BIN" --boot never "$ROM_PATH" >"$OUT_DIR/melonds.log" 2>&1 &
EMU_PID="$!"

sleep 5
if ! kill -0 "$EMU_PID" 2>/dev/null; then
  echo "melonDS exited before capture" >&2
  exit 1
fi

import -display "$DISPLAY" -window root "$OUT_DIR/boot-frame.png"

ffmpeg -y -video_size 1280x720 -framerate 30 -f x11grab -i "$DISPLAY" -t 8 \
  "$OUT_DIR/smoke.mp4" >"$OUT_DIR/ffmpeg.log" 2>&1 &
FFMPEG_PID="$!"

sleep 6
if ! kill -0 "$EMU_PID" 2>/dev/null; then
  echo "melonDS exited during capture" >&2
  exit 1
fi

import -display "$DISPLAY" -window root "$OUT_DIR/steady-frame.png"

wait "$FFMPEG_PID"
FFMPEG_PID=""

ffmpeg -y -i "$OUT_DIR/smoke.mp4" -vf "fps=8,scale=960:-1:flags=lanczos" \
  "$OUT_DIR/smoke.gif" >>"$OUT_DIR/ffmpeg.log" 2>&1
