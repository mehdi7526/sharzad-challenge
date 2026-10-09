import 'server-only';
import { getBackendData } from '@/shared/lib/backend-request';
import { ApiError } from '@/shared/lib/api-error';
import type { HomepageResult, ViewerData } from '../types';
import { parseHomepageData, parseViewerData } from './home-contract';
import { homeEndpoints } from './home-endpoints';

export async function getHomepageData(): Promise<HomepageResult> {
  try {
    const data = await getBackendData(homeEndpoints.homepage, parseHomepageData);
    return { ok: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        status: error.status ?? 502,
        message: error.message,
        details: error.details,
      };
    }
    throw error;
  }
}

export function getViewerData(): Promise<ViewerData> {
  return getBackendData(homeEndpoints.viewer, parseViewerData);
}
