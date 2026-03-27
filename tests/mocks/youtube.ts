export type MockYouTubePlayer = {
  cueVideoById: ReturnType<typeof vi.fn>;
  playVideo: ReturnType<typeof vi.fn>;
  pauseVideo: ReturnType<typeof vi.fn>;
  stopVideo: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
  getPlayerState: ReturnType<typeof vi.fn>;
};

import { vi } from 'vitest';

export const createMockYouTubePlayer = (): MockYouTubePlayer => ({
  cueVideoById: vi.fn(),
  playVideo: vi.fn(),
  pauseVideo: vi.fn(),
  stopVideo: vi.fn(),
  destroy: vi.fn(),
  getPlayerState: vi.fn().mockReturnValue(1),
});

export const mockYouTubeWindowApi = () => {
  const player = createMockYouTubePlayer();
  const ytApi = {
    Player: vi.fn().mockImplementation(() => player),
  };

  Object.defineProperty(window, 'YT', {
    configurable: true,
    writable: true,
    value: ytApi,
  });

  return { ytApi, player };
};
