import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const tempRoots = [];

afterEach(() => {
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop(), { recursive: true, force: true });
  }
});

describe('emulator UI script', () => {
  it(
    'captures interaction frames and records a navigation clip with fake tools',
    async () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-hymn-rom-ui-'));
      tempRoots.push(root);

      const fakeBinDir = path.join(root, 'fake-bin');
      const emulatorPath = path.join(root, 'fake-emulator.sh');
      const romPath = path.join(root, 'fake.nds');
      const outDir = path.join(root, 'artifacts');
      const displayReadyPath = path.join(root, 'display-ready');
      const captureStatePath = path.join(root, 'capture-state.txt');
      const keyLogPath = path.join(root, 'keys.log');

      fs.mkdirSync(fakeBinDir, { recursive: true });
      fs.writeFileSync(captureStatePath, 'initial');

      fs.writeFileSync(
        emulatorPath,
        [
          '#!/usr/bin/env bash',
          'set -euo pipefail',
          'trap "exit 0" TERM INT',
          'while true; do sleep 1; done',
        ].join('\n'),
      );
      fs.chmodSync(emulatorPath, 0o755);
      fs.writeFileSync(romPath, 'fake-rom');

      fs.writeFileSync(
        path.join(fakeBinDir, 'fake-xvfb.sh'),
        [
          '#!/usr/bin/env bash',
          'set -euo pipefail',
          'trap "exit 0" TERM INT',
          'sleep 0.2',
          'touch "${DISPLAY_READY_PATH:?}"',
          'while true; do sleep 1; done',
        ].join('\n'),
      );
      fs.writeFileSync(
        path.join(fakeBinDir, 'fake-xdpyinfo.sh'),
        [
          '#!/usr/bin/env bash',
          'set -euo pipefail',
          'test -f "${DISPLAY_READY_PATH:?}"',
        ].join('\n'),
      );
      fs.writeFileSync(
        path.join(fakeBinDir, 'fake-xdotool.sh'),
        [
          '#!/usr/bin/env bash',
          'set -euo pipefail',
          'if [[ "$1" == "search" ]]; then',
          '  echo 4242',
          '  exit 0',
          'fi',
          'if [[ "$1" == "windowactivate" ]]; then',
          '  exit 0',
          'fi',
          'if [[ "$1" == "key" ]]; then',
          '  key="${@: -1}"',
          '  printf "%s\\n" "$key" >> "${KEY_LOG_PATH:?}"',
          '  if [[ "$key" == "Right" ]]; then printf "after-right" > "${CAPTURE_STATE_PATH:?}"; fi',
          '  if [[ "$key" == "Down" ]]; then printf "after-down" > "${CAPTURE_STATE_PATH:?}"; fi',
          '  exit 0',
          'fi',
          'exit 1',
        ].join('\n'),
      );
      fs.writeFileSync(
        path.join(fakeBinDir, 'fake-import.sh'),
        [
          '#!/usr/bin/env bash',
          'set -euo pipefail',
          'output="${@: -1}"',
          'state="$(cat "${CAPTURE_STATE_PATH:?}")"',
          'printf "%s" "$state" > "$output"',
        ].join('\n'),
      );
      fs.writeFileSync(
        path.join(fakeBinDir, 'fake-compare.sh'),
        [
          '#!/usr/bin/env bash',
          'set -euo pipefail',
          'left="$3"',
          'right="$4"',
          'if cmp -s "$left" "$right"; then',
          '  printf "0" >&2',
          'else',
          '  printf "17" >&2',
          'fi',
        ].join('\n'),
      );
      fs.writeFileSync(
        path.join(fakeBinDir, 'fake-ffmpeg.sh'),
        [
          '#!/usr/bin/env bash',
          'set -euo pipefail',
          'output="${@: -1}"',
          'printf "fake-video" > "$output"',
        ].join('\n'),
      );

      for (const name of [
        'fake-xvfb.sh',
        'fake-xdpyinfo.sh',
        'fake-xdotool.sh',
        'fake-import.sh',
        'fake-compare.sh',
        'fake-ffmpeg.sh',
      ]) {
        fs.chmodSync(path.join(fakeBinDir, name), 0o755);
      }

      await execFileAsync('bash', ['scripts/emulator-ui-test.sh'], {
        cwd: path.resolve('.'),
        env: {
          ...process.env,
          EMULATOR_BIN: emulatorPath,
          ROM_PATH: romPath,
          OUT_DIR: outDir,
          DISPLAY_ID: ':97',
          DISPLAY_READY_PATH: displayReadyPath,
          CAPTURE_STATE_PATH: captureStatePath,
          KEY_LOG_PATH: keyLogPath,
          XVFB_BIN: path.join(fakeBinDir, 'fake-xvfb.sh'),
          XDPYINFO_BIN: path.join(fakeBinDir, 'fake-xdpyinfo.sh'),
          XDOTOOL_BIN: path.join(fakeBinDir, 'fake-xdotool.sh'),
          IMPORT_BIN: path.join(fakeBinDir, 'fake-import.sh'),
          COMPARE_BIN: path.join(fakeBinDir, 'fake-compare.sh'),
          FFMPEG_BIN: path.join(fakeBinDir, 'fake-ffmpeg.sh'),
        },
        timeout: 40000,
      });

      expect(fs.readFileSync(path.join(outDir, 'ui-initial.png'), 'utf8')).toBe('initial');
      expect(fs.readFileSync(path.join(outDir, 'ui-after-right.png'), 'utf8')).toBe('after-right');
      expect(fs.readFileSync(path.join(outDir, 'ui-after-down.png'), 'utf8')).toBe('after-down');
      expect(fs.existsSync(path.join(outDir, 'ui-navigation.mp4'))).toBe(true);
      expect(fs.existsSync(path.join(outDir, 'ui-navigation.gif'))).toBe(true);
      expect(fs.readFileSync(path.join(keyLogPath), 'utf8')).toContain('Right');
      expect(fs.readFileSync(path.join(keyLogPath), 'utf8')).toContain('Down');
      expect(fs.readFileSync(path.join(outDir, 'ui-diff-right.txt'), 'utf8').trim()).toBe('17');
      expect(fs.readFileSync(path.join(outDir, 'ui-diff-down.txt'), 'utf8').trim()).toBe('17');
    },
    40000,
  );
});
