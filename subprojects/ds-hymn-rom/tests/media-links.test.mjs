import { describe, expect, it } from 'vitest';
import { checkReadme, createMediaLinks } from '../scripts/media-links.mjs';

describe('README media publication contract', () => {
  it('produces stable media URLs for the publication branch', () => {
    const links = createMediaLinks();

    expect(links.bootFrame).toContain('/ds-hymn-rom-media/');
    expect(links.steadyFrame).toContain('/steady-frame.png');
    expect(links.smokeGif).toContain('/smoke.gif');
    expect(links.smokeVideo).toContain('/smoke.mp4');
  });

  it('keeps README media links aligned with the published branch URLs', () => {
    const result = checkReadme();
    expect(result.missing).toEqual([]);
  });
});
