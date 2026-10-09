import 'client-only';

import axios from 'axios';
import { normalizeApiError } from './api-error';

// Browser requests use the internal API. Backend URLs stay on the server.
export const apiRequest = axios.create({
  baseURL: '/api',
  timeout: 11000,
  headers: { Accept: 'application/json' },
});

apiRequest.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);
