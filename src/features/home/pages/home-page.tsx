import { connection } from 'next/server';
import { ApiError } from '@/shared/lib/api-error';
import type { HomepageData } from '../types';
import { getHomepage } from '../api/home-api';
import { HomeContent } from '../components/home-content';
import { HomeShell } from '../components/home-shell';
import { ServicesGrid } from '../components/services-grid';

export async function HomePage() {
  await connection();
  let initialData: HomepageData | undefined;
  let initialError: string | undefined;
  try {
    const response = await getHomepage();
    initialData = response.data;
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    initialError = error.message;
  }
  return (
    <HomeShell initialData={initialData}>
      <HomeContent initialData={initialData} initialError={initialError}>
        <ServicesGrid initialData={initialData} initialError={initialError} />
      </HomeContent>
    </HomeShell>
  );
}
