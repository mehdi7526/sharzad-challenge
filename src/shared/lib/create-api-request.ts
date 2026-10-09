import axios, { type CreateAxiosDefaults, type AxiosResponse } from 'axios';
import { normalizeApiError } from './api-error';
import { parseApiResponse } from './api-response';

export function createApiRequest(config: CreateAxiosDefaults) {
  const client = axios.create({
    timeout: 11000,
    ...config,
    headers: { Accept: 'application/json', ...config.headers },
  });
  client.interceptors.request.use((request) => {
    if (!request.baseURL) throw new Error('NEXT_PUBLIC_API_BASE_URL is required');
    const url = new URL(`${request.baseURL.replace(/\/$/, '')}/`);
    if (url.protocol !== 'http:' && url.protocol !== 'https:')
      throw new Error('Invalid NEXT_PUBLIC_API_BASE_URL');
    request.baseURL = url.href;

    if (typeof window !== 'undefined') {
      if (process.env.NEXT_PUBLIC_API_USE_PROXY === 'true') request.baseURL = '/api';
      return request;
    }

    request.timeout = 8000;
    request.adapter = 'fetch';
    request.fetchOptions = { ...request.fetchOptions, cache: 'no-store' };
    return request;
  });
  client.interceptors.response.use(
    (response: AxiosResponse<unknown>) => {
      try {
        parseApiResponse(response.data);
        return response;
      } catch (error) {
        throw normalizeApiError(error);
      }
    },
    (error: unknown) => Promise.reject(normalizeApiError(error)),
  );
  return client;
}
