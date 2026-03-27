declare module 'vitest/config' {
  export function defineConfig(config: unknown): unknown;
}

declare module 'vitest' {
  export const describe: (...args: unknown[]) => unknown;
  export const it: (...args: unknown[]) => unknown;
  export const expect: (...args: unknown[]) => any;
  export const vi: {
    fn: (...args: unknown[]) => any;
    mocked: <T>(value: T) => any;
    clearAllMocks: () => void;
    stubGlobal: (name: string, value: unknown) => void;
  };
  export const beforeAll: (...args: unknown[]) => unknown;
  export const afterEach: (...args: unknown[]) => unknown;
}

declare module '@testing-library/react' {
  export const render: (...args: unknown[]) => any;
  export const screen: Record<string, (...args: unknown[]) => any>;
  export const renderHook: (...args: unknown[]) => { result: { current: any } };
  export const waitFor: (callback: () => unknown) => Promise<void>;
}

declare module '@testing-library/jest-dom/vitest';

declare module 'react' {
  export const useEffect: (...args: unknown[]) => unknown;
  export const useState: <T>(initialState: T) => [T, (value: T) => void];
}

declare module 'react/jsx-runtime' {
  export const Fragment: unknown;
  export const jsx: (...args: unknown[]) => unknown;
  export const jsxs: (...args: unknown[]) => unknown;
}
