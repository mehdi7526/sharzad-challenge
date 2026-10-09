import 'server-only';
import { createApiRequest } from '@/shared/lib/create-api-request';
import type { ApiResponse } from '@/shared/types';
import type { HomepageData, ViewerData } from '../types';

const apiRequest = createApiRequest({
  timeout: 8000,
  adapter: 'fetch',
  fetchOptions: { cache: 'no-store' },
});

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

export async function getHomepageData(): Promise<ApiResponse<HomepageData>> {
  const response = await apiRequest.get<ApiResponse<HomepageData>>(backendUrl('/home').href);
  return response.data;
}

export async function getViewerData(): Promise<ApiResponse<ViewerData>> {
  const response = await apiRequest.get<ApiResponse<ViewerData>>(backendUrl('/viewer').href);
  return response.data;
}
