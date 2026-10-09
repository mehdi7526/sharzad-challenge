import { NextResponse } from 'next/server';
import {
  apiErrorResponse,
  type ApiErrorResponse,
  type ApiResponse,
} from '@/shared/lib/api-response';
import type { HomepageData } from '@/features/home/types';
import { getHomepageData } from '@/features/home/api/home-server';

const headers = { 'Cache-Control': 'no-store' };

export async function GET() {
  try {
    const result = await getHomepageData();
    return result.ok
      ? NextResponse.json<ApiResponse<HomepageData>>(
          { meta: { success: true }, data: result.data },
          { headers },
        )
      : NextResponse.json<ApiErrorResponse>(
          {
            ...apiErrorResponse(result.message, result.status),
            ...(result.details ? { meta: result.details } : {}),
          },
          { status: result.status, headers },
        );
  } catch (error) {
    console.error('Unexpected homepage API error', error);
    return NextResponse.json<ApiErrorResponse>(
      apiErrorResponse('خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.', 500, 'INTERNAL_ERROR'),
      { status: 500, headers },
    );
  }
}
