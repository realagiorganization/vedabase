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

describe('emulator smoke script', () => {
  it(
    'captures boot and steady frames plus smoke video artifacts with a fake emulator',
    async () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-hymn-rom-emu-'));
      tempRoots.push(root);

      const fakeBinDir = path.join(root, 'fake-bin');
      const emulatorPath = path.join(root, 'fake-emulator.sh');
      const romPath = path.join(root, 'fake.nds');
      const outDir = path.join(root, 'artifacts');
      const displayReadyPath = path.join(root, 'display-ready');

      fs.mkdirSync(fakeBinDir, { recursive: true });

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
        path.join(fakeBinDir, 'fake-import.sh'),
        [
          '#!/usr/bin/env bash',
          'set -euo pipefail',
          'output="${@: -1}"',
          'printf "fake-frame" > "$output"',
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
      fs.chmodSync(path.join(fakeBinDir, 'fake-xvfb.sh'), 0o755);
      fs.chmodSync(path.join(fakeBinDir, 'fake-xdpyinfo.sh'), 0o755);
      fs.chmodSync(path.join(fakeBinDir, 'fake-import.sh'), 0o755);
      fs.chmodSync(path.join(fakeBinDir, 'fake-ffmpeg.sh'), 0o755);

      await execFileAsync('bash', ['scripts/emulator-smoke.sh'], {
        cwd: path.resolve('.'),
        env: {
          ...process.env,
          EMULATOR_BIN: emulatorPath,
          ROM_PATH: romPath,
          OUT_DIR: outDir,
          DISPLAY_ID: ':98',
          DISPLAY_READY_PATH: displayReadyPath,
          XVFB_BIN: path.join(fakeBinDir, 'fake-xvfb.sh'),
          XDPYINFO_BIN: path.join(fakeBinDir, 'fake-xdpyinfo.sh'),
          IMPORT_BIN: path.join(fakeBinDir, 'fake-import.sh'),
          FFMPEG_BIN: path.join(fakeBinDir, 'fake-ffmpeg.sh'),
        },
        timeout: 30000,
      });

      expect(fs.existsSync(path.join(outDir, 'boot-frame.png'))).toBe(true);
      expect(fs.existsSync(path.join(outDir, 'steady-frame.png'))).toBe(true);
      expect(fs.existsSync(path.join(outDir, 'smoke.mp4'))).toBe(true);
      expect(fs.existsSync(path.join(outDir, 'smoke.gif'))).toBe(true);
      expect(fs.readFileSync(path.join(outDir, 'xvfb.log'), 'utf8')).toBeDefined();
    },
    40000,
  );
});
