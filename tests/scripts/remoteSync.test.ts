import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { Buffer } from 'node:buffer';
import { delimiter } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);

function resolveNodeBinary() {
  const candidates = [];
  const pathEntries = (process.env.PATH ?? '').split(delimiter).filter(Boolean);
  candidates.push(...pathEntries.map((entry) => path.join(entry, 'node')));

  const hostedToolcacheRoot = '/opt/hostedtoolcache/node';
  if (fs.existsSync(hostedToolcacheRoot)) {
    for (const version of fs.readdirSync(hostedToolcacheRoot).sort().reverse()) {
      candidates.push(path.join(hostedToolcacheRoot, version, 'x64', 'bin', 'node'));
    }
  }

  candidates.push(process.execPath);

  return candidates.find((candidate) => candidate && fs.existsSync(candidate)) ?? 'node';
}

function createTempDataRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'vedabase-data-'));
}

async function runNodeScript(
  scriptPath: string,
  args: string[],
  env: Record<string, string>,
) {
  return execFileAsync(resolveNodeBinary(), [scriptPath, ...args], {
    cwd: path.resolve('.'),
    env: {
      ...process.env,
      ...env,
    },
  });
}

describe('remote datasource sync scripts', () => {
  it('syncs a remote vedabase dump into cache artifacts', async () => {
    const dataRoot = createTempDataRoot();
    const payload = {
      hymns: [
        {
          id: 'test-hymn',
          chapterId: 'chapter-1',
          title: 'Test Hymn',
          sanskrit: 'om test',
          transliteration: 'om test',
          translation: 'A synchronized test hymn.',
          deity: 'Agni',
          verseCount: 3,
          tags: ['featured'],
        },
      ],
    };
    const sourcePath = path.join(dataRoot, 'vedabase-source.json');
    fs.writeFileSync(sourcePath, JSON.stringify(payload));

    await runNodeScript(
      'scripts/sync-vedabase-dump.mjs',
      [sourcePath],
      { VEDABASE_DATA_ROOT: dataRoot },
    );

    const cache = JSON.parse(
      fs.readFileSync(path.join(dataRoot, 'cache', 'vedabase-index.json'), 'utf8'),
    );

    expect(cache.hymns).toHaveLength(1);
    expect(cache.hymns[0]?.id).toBe('test-hymn');
  });

  it('syncs youtube search results through the template endpoint', async () => {
    const dataRoot = createTempDataRoot();
    const payload = {
      results: [
        {
          videoId: 'yt-test-1',
          title: 'Test Hymn Reciter',
          channelTitle: 'Vedabase Test Channel',
          description: 'A deterministic test video.',
        },
      ],
    };

    fs.mkdirSync(path.join(dataRoot, 'remote', 'vedabase-dump'), { recursive: true });
    fs.writeFileSync(
      path.join(dataRoot, 'remote', 'vedabase-dump', 'metadata.json'),
      JSON.stringify({
        dataset: 'vedabase-dump',
        status: 'fresh',
        complete: true,
        itemCount: 1,
      }),
    );
    const sourcePath = path.join(dataRoot, 'youtube-Test%20Hymn.json');
    fs.writeFileSync(sourcePath, JSON.stringify(payload));

    await runNodeScript(
      'scripts/sync-youtube-search.mjs',
      ['Test Hymn'],
      {
        VEDABASE_DATA_ROOT: dataRoot,
        YOUTUBE_SEARCH_SOURCE_TEMPLATE: path.join(dataRoot, 'youtube-{query}.json'),
      },
    );

    const cache = JSON.parse(
      fs.readFileSync(path.join(dataRoot, 'cache', 'youtube-search-index.json'), 'utf8'),
    );

    expect(cache.queries).toHaveLength(1);
    expect(cache.queries[0]?.results[0]?.videoId).toBe('yt-test-1');
  });

  it('resumes a partial vedabase dump download over http range requests', async () => {
    const dataRoot = createTempDataRoot();
    const payload = JSON.stringify({
      hymns: [
        {
          id: 'resume-hymn',
          chapterId: 'chapter-resume',
          title: 'Resume Hymn',
          sanskrit: 'om resume',
          translation: 'Resumable payload',
        },
      ],
    });

    const partialBytes = payload.slice(0, Math.floor(payload.length / 2));
    const rawDir = path.join(dataRoot, 'remote', 'vedabase-dump');
    fs.mkdirSync(rawDir, { recursive: true });
    fs.writeFileSync(path.join(rawDir, 'latest.json.part'), partialBytes);

    let sawRangeHeader = false;
    const server = http.createServer((request, response) => {
      const rangeHeader = request.headers.range;
      if (rangeHeader) {
        sawRangeHeader = true;
        const [, startRaw] = /bytes=(\d+)-/.exec(rangeHeader) ?? [];
        const start = Number(startRaw);
        const chunk = payload.slice(start);
        response.writeHead(206, {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(chunk),
          'Content-Range': `bytes ${start}-${payload.length - 1}/${payload.length}`,
          'Accept-Ranges': 'bytes',
        });
        response.end(chunk);
        return;
      }

      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Accept-Ranges': 'bytes',
      });
      response.end(payload);
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve());
    });

    try {
      const address = server.address();
      if (!address || typeof address === 'string') {
        throw new Error('Expected TCP address');
      }

      const { stdout } = await runNodeScript(
        'scripts/sync-vedabase-dump.mjs',
        [`http://127.0.0.1:${address.port}/vedabase.json`],
        { VEDABASE_DATA_ROOT: dataRoot },
      );

      const raw = fs.readFileSync(path.join(rawDir, 'latest.json'), 'utf8');
      const metadata = JSON.parse(
        fs.readFileSync(path.join(rawDir, 'metadata.json'), 'utf8'),
      );

      expect(sawRangeHeader).toBe(true);
      expect(raw).toBe(payload);
      expect(stdout).toContain('Resumed partial Vedabase download');
      expect(metadata.notes[0]).toContain('resumed');
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  });
});
