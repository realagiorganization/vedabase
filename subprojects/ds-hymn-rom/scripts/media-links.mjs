import fs from 'node:fs';
import path from 'node:path';

export function createMediaLinks({
  owner = 'realagiorganization',
  repo = 'vedabase',
  branch = 'ds-hymn-rom-media',
  baseDir = 'subprojects/ds-hymn-rom/media/latest',
} = {}) {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${baseDir}`;

  return {
    bootFrame: `${rawBase}/boot-frame.png`,
    steadyFrame: `${rawBase}/steady-frame.png`,
    smokeGif: `${rawBase}/smoke.gif`,
    smokeVideo: `${rawBase}/smoke.mp4`,
    uiInitial: `${rawBase}/ui-initial.png`,
    uiAfterRight: `${rawBase}/ui-after-right.png`,
    uiAfterDown: `${rawBase}/ui-after-down.png`,
    uiNavigationGif: `${rawBase}/ui-navigation.gif`,
    uiNavigationVideo: `${rawBase}/ui-navigation.mp4`,
  };
}

export function checkReadme(readmePath = path.resolve('README.md')) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const links = createMediaLinks();
  const missing = Object.values(links).filter((url) => !readme.includes(url));

  return {
    links,
    missing,
  };
}

if (process.argv.includes('--check-readme')) {
  const result = checkReadme();
  if (result.missing.length > 0) {
    console.error(`README media links are missing:\n${result.missing.join('\n')}`);
    process.exit(1);
  }
  console.log('README media links are aligned.');
}
