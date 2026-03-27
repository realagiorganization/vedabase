import { vi } from 'vitest';

export type MockAudioContext = {
  createAnalyser: ReturnType<typeof vi.fn>;
  createGain: ReturnType<typeof vi.fn>;
  createMediaElementSource: ReturnType<typeof vi.fn>;
  resume: ReturnType<typeof vi.fn>;
  suspend: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  destination: object;
};

export const createMockAudioContext = (): MockAudioContext => ({
  createAnalyser: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    fftSize: 2048,
  }),
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: { value: 1 },
  }),
  createMediaElementSource: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
  resume: vi.fn().mockResolvedValue(undefined),
  suspend: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  destination: {},
});

export const mockWebAudioApi = () => {
  const audioContext = createMockAudioContext();
  const AudioContextCtor = vi.fn().mockImplementation(() => audioContext);

  vi.stubGlobal('AudioContext', AudioContextCtor);
  vi.stubGlobal('webkitAudioContext', AudioContextCtor);

  return { AudioContextCtor, audioContext };
};
