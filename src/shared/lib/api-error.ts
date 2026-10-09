import { isAxiosError, isCancel } from 'axios';
import {
  ApiContractError,
  parseApiResponse,
  parseApiErrorResponse,
  type ApiErrorResponse,
} from './api-response';

export { ApiContractError } from './api-response';

export class ApiError extends Error {
  readonly status?: number;
  readonly details?: ApiErrorResponse['meta'];

  constructor(
    message: string,
    status?: number,
    cause?: unknown,
    details?: ApiErrorResponse['meta'],
  ) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function normalizeApiError(error: unknown): Error {
  if (error instanceof ApiError || isCancel(error)) return error;
  if (!isAxiosError<unknown>(error)) {
    return error instanceof Error
      ? error
      : new Error('خطای غیرمنتظره‌ای رخ داد.', { cause: error });
  }

  const body = parseApiErrorResponse(error.response?.data);
  const status = error.response?.status;
  if (body) return new ApiError(body.message, status, error, body.meta);
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new ApiError('دریافت اطلاعات بیش از حد طول کشید. دوباره تلاش کنید.', status, error);
  }
  if (!error.response) {
    return new ApiError('ارتباط برقرار نشد. اتصال اینترنت را بررسی کنید.', undefined, error);
  }
  return new ApiError('دریافت اطلاعات انجام نشد. دوباره تلاش کنید.', status, error);
}

// One boundary for network validation; domain APIs only describe the request and response.
export function readApiData<T>(response: unknown, parse: (data: unknown) => T): T {
  try {
    return parseApiResponse(response, parse);
  } catch (error) {
    if (error instanceof ApiContractError) {
      throw new ApiError('پاسخ سرویس معتبر نیست. دوباره تلاش کنید.', 502, error);
    }
    throw error;
  }
}
