import 'client-only';
import { createApiRequest } from './create-api-request';

export const apiRequest = createApiRequest({ baseURL: '/api' });
