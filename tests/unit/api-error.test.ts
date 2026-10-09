import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { ApiError, normalizeApiError, readApiData } from '@/shared/lib/api-error';
import { apiErrorResponse } from '@/shared/lib/api-response';
import { parseViewerData } from '@/features/home/api/home-contract';

describe('API errors', () => {
  it('preserves the message, status and details of an HTTP error', () => {
    const body = apiErrorResponse('سرویس در دسترس نیست', 503, 'SERVICE_UNAVAILABLE');
    const cause = new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
      data: body,
      status: 503,
      statusText: 'Service Unavailable',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    const error = normalizeApiError(cause);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: body.message, status: 503, details: body.meta, cause });
  });

  it('distinguishes timeout from a connection failure', () => {
    const timeout = normalizeApiError(new AxiosError('timeout', 'ECONNABORTED'));
    const offline = normalizeApiError(new AxiosError('network', 'ERR_NETWORK'));
    expect(timeout.message).toContain('بیش از حد طول کشید');
    expect(offline.message).toContain('اتصال اینترنت');
  });

  it('does not replace an existing domain error', () => {
    const error = new ApiError('خطای حساب', 401);
    expect(normalizeApiError(error)).toBe(error);
  });

  it('converts invalid successful response data to a displayable contract error', () => {
    expect(() =>
      readApiData({ meta: { success: true }, data: { signedIn: true } }, parseViewerData),
    ).toThrow('پاسخ سرویس معتبر نیست');
    try {
      readApiData({ meta: { success: true }, data: null }, parseViewerData);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 502 });
    }
  });

  it('does not disguise unexpected parser bugs as network errors', () => {
    const bug = new Error('Unexpected parser bug');
    expect(() =>
      readApiData({ meta: { success: true }, data: {} }, () => {
        throw bug;
      }),
    ).toThrow(bug);
  });
});
