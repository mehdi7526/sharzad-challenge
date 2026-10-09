import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios';
import { normalizeApiError } from './api-error';

export function createApiRequest(config: CreateAxiosDefaults): AxiosInstance {
  const client = axios.create({
    timeout: 11000,
    ...config,
    headers: { Accept: 'application/json', ...config.headers },
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(normalizeApiError(error)),
  );

  return client;
}
