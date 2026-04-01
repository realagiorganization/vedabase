#!/usr/bin/env bash

set -euo pipefail

: "${EMULATOR_BIN:?EMULATOR_BIN is required}"
: "${ROM_PATH:?ROM_PATH is required}"
: "${OUT_DIR:?OUT_DIR is required}"

DISPLAY_ID="${DISPLAY_ID:-:99}"
SCREEN_SIZE="${SCREEN_SIZE:-1280x720x24}"
XVFB_BIN="${XVFB_BIN:-Xvfb}"
XDPYINFO_BIN="${XDPYINFO_BIN:-xdpyinfo}"
IMPORT_BIN="${IMPORT_BIN:-import}"
FFMPEG_BIN="${FFMPEG_BIN:-ffmpeg}"
HOME_DIR="$(mktemp -d)"
FFMPEG_PID=""
EMU_PID=""
XVFB_PID=""

wait_for_display() {
  local attempts="${1:-20}"
  local delay="${2:-0.5}"

  while (( attempts > 0 )); do
    if DISPLAY="$DISPLAY_ID" "$XDPYINFO_BIN" >/dev/null 2>&1; then
      return 0
    fi
    sleep "$delay"
    attempts=$((attempts - 1))
  done

  echo "X display $DISPLAY_ID was not ready for capture" >&2
  return 1
}

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

"$XVFB_BIN" "$DISPLAY_ID" -screen 0 "$SCREEN_SIZE" >"$OUT_DIR/xvfb.log" 2>&1 &
XVFB_PID="$!"
wait_for_display

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

"$IMPORT_BIN" -display "$DISPLAY" -window root "$OUT_DIR/boot-frame.png"

"$FFMPEG_BIN" -y -video_size 1280x720 -framerate 30 -f x11grab -i "$DISPLAY" -t 8 \
  "$OUT_DIR/smoke.mp4" >"$OUT_DIR/ffmpeg.log" 2>&1 &
FFMPEG_PID="$!"

sleep 6
if ! kill -0 "$EMU_PID" 2>/dev/null; then
  echo "melonDS exited during capture" >&2
  exit 1
fi

"$IMPORT_BIN" -display "$DISPLAY" -window root "$OUT_DIR/steady-frame.png"

wait "$FFMPEG_PID"
FFMPEG_PID=""

"$FFMPEG_BIN" -y -i "$OUT_DIR/smoke.mp4" -vf "fps=8,scale=960:-1:flags=lanczos" \
  "$OUT_DIR/smoke.gif" >>"$OUT_DIR/ffmpeg.log" 2>&1
