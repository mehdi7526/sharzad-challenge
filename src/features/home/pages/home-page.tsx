import { connection } from 'next/server';
import { ApiError } from '@/shared/lib/api-error';
import type { HomepageResult } from '../types';
import { getHomepageData } from '../api/home-server';
import { HomeContent } from '../components/home-content';
import { HomeShell } from '../components/home-shell';
import { ServicesGrid } from '../components/services-grid';

export async function HomePage() {
  await connection();
  let result: HomepageResult;
  try {
    const response = await getHomepageData();
    result = { ok: true, data: response.data };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    result = {
      ok: false,
      status: error.status ?? 502,
      message: error.message,
      details: error.details,
    };
  }
  return (
    <HomeShell initialResult={result}>
      <HomeContent initialResult={result}>
        <ServicesGrid initialResult={result} />
      </HomeContent>
    </HomeShell>
  );
}
