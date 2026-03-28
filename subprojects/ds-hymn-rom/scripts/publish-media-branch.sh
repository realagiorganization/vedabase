#!/usr/bin/env bash

set -euo pipefail

: "${REPO_URL:?REPO_URL is required}"
: "${SOURCE_DIR:?SOURCE_DIR is required}"

BRANCH="${BRANCH:-ds-hymn-rom-media}"
TARGET_DIR="${TARGET_DIR:-subprojects/ds-hymn-rom/media/latest}"
WORKDIR="$(mktemp -d)"

cleanup() {
  rm -rf "$WORKDIR"
}

trap cleanup EXIT

if git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$WORKDIR/repo" 2>/dev/null; then
  :
else
  git clone --depth 1 "$REPO_URL" "$WORKDIR/repo"
  cd "$WORKDIR/repo"
  git checkout --orphan "$BRANCH"
  git rm -rf . >/dev/null 2>&1 || true
fi

cd "$WORKDIR/repo"
mkdir -p "$TARGET_DIR"
find "$TARGET_DIR" -maxdepth 1 -type f -delete
cp -f "$SOURCE_DIR"/* "$TARGET_DIR"/

git add "$TARGET_DIR"

if git diff --cached --quiet; then
  echo "No media changes to publish."
  exit 0
fi

git commit -m "chore(ds-hymn-rom): refresh emulator media [skip ci]"
git push origin "$BRANCH"
