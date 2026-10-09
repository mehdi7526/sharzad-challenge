import type { AxiosAdapter } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
beforeEach(() => vi.resetModules());

const response = { meta: { success: true }, data: {} };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('shared API request environment', () => {
  it.each([
    ['true', '/api'],
    ['false', 'https://public.example.com/v1/'],
  ])(
    'uses the configured browser target (%s) without server configuration',
    async (useProxy, expectedBaseURL) => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://public.example.com/v1');
      vi.stubEnv('NEXT_PUBLIC_API_USE_PROXY', useProxy);
      vi.stubGlobal('window', {});
      const { apiRequest } = await import('@/shared/lib/api-request');
      const { getHomepage, getViewer } = await import('@/features/home/api/home-api');
      const adapter = vi.fn<AxiosAdapter>(async (config) => ({
        data: response,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      }));
      const previousAdapter = apiRequest.defaults.adapter;
      apiRequest.defaults.adapter = adapter;
      try {
        await expect(getHomepage()).resolves.toEqual(response);
        await expect(getViewer()).resolves.toEqual(response);
        expect(adapter).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            baseURL: expectedBaseURL,
            url: '/home',
            timeout: 11000,
          }),
        );
        expect(adapter).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            baseURL: expectedBaseURL,
            url: '/viewer',
            timeout: 11000,
          }),
        );
      } finally {
        apiRequest.defaults.adapter = previousAdapter;
      }
    },
  );

  it.each(['ftp://public.example.com', 'not-a-url'])(
    'rejects invalid browser URLs (%s)',
    async (url) => {
      vi.stubGlobal('window', {});
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', url);
      const { getViewer } = await import('@/features/home/api/home-api');
      await expect(getViewer()).rejects.toBeInstanceOf(Error);
    },
  );

  it('uses the configured project backend on the server', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://127.0.0.1:4000');
    const { getHomepage } = await import('@/features/home/api/home-api');
    const fetchMock = vi.fn().mockResolvedValue(Response.json(response));
    vi.stubGlobal('fetch', fetchMock);
    await getHomepage();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'http://127.0.0.1:4000/home' }),
      expect.anything(),
    );
  });

  it('uses the configured server URL even with browser proxy enabled and preserves path prefixes', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_USE_PROXY', 'true');
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.com/v1/');
    const { apiRequest } = await import('@/shared/lib/api-request');
    const { getHomepage, getViewer } = await import('@/features/home/api/home-api');
    const fetchMock = vi.fn().mockImplementation(async () => Response.json(response));
    vi.stubGlobal('fetch', fetchMock);
    await getHomepage();
    await getViewer();
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ url: 'https://api.example.com/v1/home', cache: 'no-store' }),
      expect.objectContaining({ cache: 'no-store' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ url: 'https://api.example.com/v1/viewer', cache: 'no-store' }),
      expect.objectContaining({ cache: 'no-store' }),
    );
    expect(apiRequest.defaults.baseURL).toBe('https://api.example.com/v1/');
    expect(apiRequest.defaults.timeout).toBe(11000);
  });

  it.each([
    ['', 'NEXT_PUBLIC_API_BASE_URL is required'],
    ['ftp://api.example.com', 'Invalid NEXT_PUBLIC_API_BASE_URL'],
  ])('rejects invalid server configuration (%s)', async (url, message) => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', url);
    const { getHomepage } = await import('@/features/home/api/home-api');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(getHomepage()).rejects.toThrow(message);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
