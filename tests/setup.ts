import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, vi } from 'vitest';

const defaultFetchResponse = {
  ok: true,
  status: 200,
  json: async () => ({}),
};

beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(defaultFetchResponse));

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  vi.clearAllMocks();
});
