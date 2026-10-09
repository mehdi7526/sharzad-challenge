import { createApiRequest } from './create-api-request';

export const apiRequest = createApiRequest({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
