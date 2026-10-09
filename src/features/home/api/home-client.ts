import { apiRequest } from '@/shared/lib/api-request';
import { readApiData } from '@/shared/lib/api-error';
import type { ApiResponse } from '@/shared/lib/api-response';
import type { HomepageData, ViewerData } from '../types';
import { parseHomepageData, parseViewerData } from './home-contract';
import { homeEndpoints } from './home-endpoints';

export async function getHomepage(): Promise<HomepageData> {
  const response = await apiRequest.get<ApiResponse<HomepageData>>(homeEndpoints.homepage);
  return readApiData(response.data, parseHomepageData);
}

export async function getViewer(): Promise<ViewerData> {
  const response = await apiRequest.get<ApiResponse<ViewerData>>(homeEndpoints.viewer);
  return readApiData(response.data, parseViewerData);
}
