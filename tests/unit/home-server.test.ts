import { AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { getHomepageData as request } from '@/features/home/api/home-server';
import { ApiError } from '@/shared/lib/api-error';
import { apiErrorResponse } from '@/shared/lib/api-response';

const homepage = {
  services: [{ id: 'demo', title: 'Demo', image: '/demo.webp', href: '#' }],
  banner: { image: '/banner.webp', alt: 'Demo', serviceId: 'demo' },
};
const payload = homepage;

describe('server API /home', () => {
  beforeEach(() => {
    vi.stubEnv('HOME_DATA_SOURCE', 'backend');
    vi.stubEnv('API_BASE_URL', 'https://api.example.com');
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns the validated upstream response envelope', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ meta: { success: true }, data: payload }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(request()).resolves.toEqual({ meta: { success: true }, data: payload });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://api.example.com/home', cache: 'no-store' }),
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('converts transport failures into a 502 API error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('connection failed')));
    await expect(request()).rejects.toBeInstanceOf(ApiError);
  });

  it('converts invalid network JSON into a 502 API error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('invalid JSON')));
    await expect(request()).rejects.toMatchObject({ status: 502 });
  });

  it('preserves upstream HTTP error status and details', async () => {
    const body = apiErrorResponse('Unavailable', 503, 'UNAVAILABLE');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body, { status: 503 })));
    await expect(request()).rejects.toMatchObject({
      status: 503,
      message: body.message,
      details: body.meta,
    });
  });

  it('reports upstream timeouts as 504', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new AxiosError('timeout', 'ETIMEDOUT')));
    await expect(request()).rejects.toMatchObject({ status: 504 });
  });
});
