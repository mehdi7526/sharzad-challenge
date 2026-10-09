import 'client-only';

import { createApiRequest } from './create-api-request';

// Browser requests use the internal API. Backend URLs and credentials stay on the server.
export const apiRequest = createApiRequest({ baseURL: '/api' });
