import 'server-only';

import { ApiError, readApiData } from './api-error';
import { parseApiErrorResponse } from './api-response';

function backendUrl(path: string) {
  const source = process.env.HOME_DATA_SOURCE ?? 'mock';
  if (source !== 'mock' && source !== 'backend') throw new Error('Invalid HOME_DATA_SOURCE');
  const baseURL = process.env.API_BASE_URL || (source === 'mock' ? 'http://127.0.0.1:4000' : '');
  if (!baseURL) throw new Error('API_BASE_URL is required when HOME_DATA_SOURCE=backend');
  const url = new URL(path.replace(/^\//, ''), `${baseURL.replace(/\/$/, '')}/`);
  if (url.protocol !== 'http:' && url.protocol !== 'https:')
    throw new Error('Invalid API_BASE_URL');
  return url;
}

export async function getBackendData<T>(path: string, parse: (value: unknown) => T): Promise<T> {
  const url = backendUrl(path);
  const signal = AbortSignal.timeout(8000);
  let data: unknown;
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      const body = parseApiErrorResponse(await response.json().catch(() => null));
      throw new ApiError(
        body?.message ?? 'اطلاعات موقتاً در دسترس نیستند. دوباره تلاش کنید.',
        response.status,
        undefined,
        body?.meta,
      );
    }
    data = await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (signal.aborted) {
      throw new ApiError('دریافت اطلاعات بیش از حد طول کشید. دوباره تلاش کنید.', 504, error);
    }
    if (error instanceof SyntaxError) {
      throw new ApiError('پاسخ سرویس معتبر نیست. دوباره تلاش کنید.', 502, error);
    }
    if (error instanceof TypeError) {
      throw new ApiError('ارتباط با سرویس برقرار نشد. دوباره تلاش کنید.', 502, error);
    }
    throw error;
  }
  return readApiData(data, parse);
}
