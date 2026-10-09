import { HomeShell } from '@/features/home/components/home-shell';
import { HomeContent } from '@/features/home/components/home-content';
import { ServicesLoading } from '@/features/home/components/services-loading';

export default function Loading() {
  return (
    <HomeShell>
      <HomeContent>
        <ServicesLoading />
      </HomeContent>
    </HomeShell>
  );
}
