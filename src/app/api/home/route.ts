import { NextResponse } from 'next/server';
import { ApiError } from '@/shared/lib/api-error';
import { apiErrorResponse } from '@/shared/lib/api-response';
import type { ApiErrorResponse, ApiResponse } from '@/shared/types';
import { getHomepage } from '@/features/home/api/home-api';
import type { HomepageData } from '@/features/home/types';

const headers = { 'Cache-Control': 'no-store' };

export async function GET() {
  try {
    const response = await getHomepage();
    return NextResponse.json<ApiResponse<HomepageData>>(response, { headers });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json<ApiErrorResponse>(
        {
          ...apiErrorResponse(error.message, error.status ?? 502),
          ...(error.details ? { meta: error.details } : {}),
        },
        { status: error.status ?? 502, headers },
      );
    }
    console.error('Unexpected home API error', error);
    return NextResponse.json<ApiErrorResponse>(
      apiErrorResponse('خطای غیرمنتظره‌ای رخ داد. دوباره تلاش کنید.', 500, 'INTERNAL_ERROR'),
      { status: 500, headers },
    );
  }
}
