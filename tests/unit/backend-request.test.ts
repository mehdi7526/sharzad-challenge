import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { getBackendData } from '@/shared/lib/backend-request';
import { ApiError } from '@/shared/lib/api-error';
import { ApiContractError, apiErrorResponse } from '@/shared/lib/api-response';

const payload = { message: 'hello' };

describe('backend request boundary', () => {
  beforeEach(() => {
    vi.stubEnv('HOME_DATA_SOURCE', 'backend');
    vi.stubEnv('API_BASE_URL', 'https://api.example.com');
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns parsed data from the upstream response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ meta: { success: true }, data: payload }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(getBackendData('/home', (data) => data)).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.example.com/home'),
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it.each([new TypeError('parser bug'), new SyntaxError('parser bug')])(
    'preserves unexpected parser errors: %s',
    async (bug) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(Response.json({ meta: { success: true }, data: payload })),
      );
      await expect(
        getBackendData('/home', () => {
          throw bug;
        }),
      ).rejects.toBe(bug);
    },
  );

  it('converts expected contract failures into a 502 API error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ meta: { success: true }, data: payload })),
    );
    await expect(
      getBackendData('/home', () => {
        throw new ApiContractError('Invalid data');
      }),
    ).rejects.toMatchObject({ status: 502 });
  });

  it('converts transport failures into a 502 API error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('connection failed')));
    await expect(getBackendData('/home', (data) => data)).rejects.toBeInstanceOf(ApiError);
  });

  it('converts invalid network JSON into a 502 API error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('invalid JSON')));
    await expect(getBackendData('/home', (data) => data)).rejects.toMatchObject({ status: 502 });
  });

  it('preserves upstream HTTP error status and details', async () => {
    const body = apiErrorResponse('Unavailable', 503, 'UNAVAILABLE');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body, { status: 503 })));
    await expect(getBackendData('/home', (data) => data)).rejects.toMatchObject({
      status: 503,
      message: body.message,
      details: body.meta,
    });
  });

  it('reports upstream timeouts as 504', async () => {
    const signal = AbortSignal.abort();
    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(signal);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(signal.reason));
    await expect(getBackendData('/home', (data) => data)).rejects.toMatchObject({ status: 504 });
  });
});
