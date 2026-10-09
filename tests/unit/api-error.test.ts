import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { ApiError, normalizeApiError } from '@/shared/lib/api-error';
import { ApiContractError, apiErrorResponse } from '@/shared/lib/api-response';

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
    expect(timeout).toMatchObject({ status: 504 });
    expect(offline).toMatchObject({ status: 502 });
    expect(timeout.message).toContain('بیش از حد طول کشید');
    expect(offline.message).toContain('اتصال اینترنت');
  });

  it('does not replace an existing domain error', () => {
    const error = new ApiError('خطای حساب', 401);
    expect(normalizeApiError(error)).toBe(error);
  });

  it('converts contract failures into a displayable 502 error', () => {
    const cause = new ApiContractError('Invalid viewer');
    expect(normalizeApiError(cause)).toMatchObject({
      status: 502,
      message: 'پاسخ سرویس معتبر نیست. دوباره تلاش کنید.',
      cause,
    });
  });

  it('does not disguise unexpected programming errors', () => {
    const bug = new TypeError('Unexpected parser bug');
    expect(normalizeApiError(bug)).toBe(bug);
  });
});
