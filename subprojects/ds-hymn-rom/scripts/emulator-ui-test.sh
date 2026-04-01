#!/usr/bin/env bash

set -euo pipefail

: "${EMULATOR_BIN:?EMULATOR_BIN is required}"
: "${ROM_PATH:?ROM_PATH is required}"
: "${OUT_DIR:?OUT_DIR is required}"

DISPLAY_ID="${DISPLAY_ID:-:99}"
SCREEN_SIZE="${SCREEN_SIZE:-1280x720x24}"
WINDOW_NAME_PATTERN="${WINDOW_NAME_PATTERN:-melonDS}"
XVFB_BIN="${XVFB_BIN:-Xvfb}"
XDPYINFO_BIN="${XDPYINFO_BIN:-xdpyinfo}"
XDOTOOL_BIN="${XDOTOOL_BIN:-xdotool}"
IMPORT_BIN="${IMPORT_BIN:-import}"
FFMPEG_BIN="${FFMPEG_BIN:-ffmpeg}"
COMPARE_BIN="${COMPARE_BIN:-compare}"
HOME_DIR="$(mktemp -d)"
FFMPEG_PID=""
EMU_PID=""
XVFB_PID=""
WINDOW_ID=""

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

  echo "X display $DISPLAY_ID was not ready for UI automation" >&2
  return 1
}

wait_for_window() {
  local attempts="${1:-30}"
  local delay="${2:-0.5}"

  while (( attempts > 0 )); do
    if WINDOW_ID="$("$XDOTOOL_BIN" search --all --name "$WINDOW_NAME_PATTERN" 2>/dev/null | head -n 1)"; then
      if [[ -n "$WINDOW_ID" ]]; then
        printf '%s\n' "$WINDOW_ID"
        return 0
      fi
    fi
    sleep "$delay"
    attempts=$((attempts - 1))
  done

  echo "melonDS window matching '$WINDOW_NAME_PATTERN' was not found" >&2
  return 1
}

capture_frame() {
  local name="$1"
  "$IMPORT_BIN" -display "$DISPLAY" -window root "$OUT_DIR/$name"
}

send_key() {
  local key="$1"
  "$XDOTOOL_BIN" windowactivate "$WINDOW_ID"
  "$XDOTOOL_BIN" key --window "$WINDOW_ID" "$key"
}

assert_frames_differ() {
  local baseline="$1"
  local current="$2"
  local metric_file="$3"

  if "$COMPARE_BIN" -metric AE "$baseline" "$current" null: 2>"$metric_file"; then
    :
  fi

  local metric
  metric="$(tr -d '[:space:]' <"$metric_file")"
  if [[ -z "$metric" || "$metric" == "0" ]]; then
    echo "UI frame comparison did not change: $baseline vs $current" >&2
    return 1
  fi
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

"$XVFB_BIN" "$DISPLAY_ID" -screen 0 "$SCREEN_SIZE" >"$OUT_DIR/ui-xvfb.log" 2>&1 &
XVFB_PID="$!"
wait_for_display

export DISPLAY="$DISPLAY_ID"
export HOME="$HOME_DIR"
export SDL_AUDIODRIVER=dummy
export QT_QPA_PLATFORM=xcb

"$EMULATOR_BIN" --boot never "$ROM_PATH" >"$OUT_DIR/ui-melonds.log" 2>&1 &
EMU_PID="$!"

sleep 5
if ! kill -0 "$EMU_PID" 2>/dev/null; then
  echo "melonDS exited before UI test capture" >&2
  exit 1
fi

WINDOW_ID="$(wait_for_window)"

"$FFMPEG_BIN" -y -video_size 1280x720 -framerate 30 -f x11grab -i "$DISPLAY" -t 12 \
  "$OUT_DIR/ui-navigation.mp4" >"$OUT_DIR/ui-ffmpeg.log" 2>&1 &
FFMPEG_PID="$!"

capture_frame "ui-initial.png"
sleep 1

send_key "Right"
sleep 1
capture_frame "ui-after-right.png"
assert_frames_differ \
  "$OUT_DIR/ui-initial.png" \
  "$OUT_DIR/ui-after-right.png" \
  "$OUT_DIR/ui-diff-right.txt"

send_key "Down"
sleep 1
capture_frame "ui-after-down.png"
assert_frames_differ \
  "$OUT_DIR/ui-after-right.png" \
  "$OUT_DIR/ui-after-down.png" \
  "$OUT_DIR/ui-diff-down.txt"

wait "$FFMPEG_PID"
FFMPEG_PID=""

"$FFMPEG_BIN" -y -i "$OUT_DIR/ui-navigation.mp4" -vf "fps=8,scale=960:-1:flags=lanczos" \
  "$OUT_DIR/ui-navigation.gif" >>"$OUT_DIR/ui-ffmpeg.log" 2>&1
