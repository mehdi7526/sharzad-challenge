import { connection } from 'next/server';
import { getHomepageData } from '../api/home-server';
import { HomeContent } from '../components/home-content';
import { HomeShell } from '../components/home-shell';
import { ServicesGrid } from '../components/services-grid';

export async function HomePage() {
  await connection();
  const result = await getHomepageData();
  return (
    <HomeShell initialResult={result}>
      <HomeContent initialResult={result}>
        <ServicesGrid initialResult={result} />
      </HomeContent>
    </HomeShell>
  );
}
