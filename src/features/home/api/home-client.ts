import { apiRequest } from '@/shared/lib/api-request';
import type { ApiResponse } from '@/shared/types';
import type { HomepageData, ViewerData } from '../types';

export async function getHomepage(): Promise<ApiResponse<HomepageData>> {
  const response = await apiRequest.get<ApiResponse<HomepageData>>('/home');
  return response.data;
}

export async function getViewer(): Promise<ApiResponse<ViewerData>> {
  const response = await apiRequest.get<ApiResponse<ViewerData>>('/viewer');
  return response.data;
}
