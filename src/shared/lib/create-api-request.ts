import axios, { type CreateAxiosDefaults, type AxiosResponse } from 'axios';
import { normalizeApiError } from './api-error';
import { parseApiResponse } from './api-response';

export function createApiRequest(config: CreateAxiosDefaults) {
  const client = axios.create({
    timeout: 11000,
    ...config,
    headers: { Accept: 'application/json', ...config.headers },
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
