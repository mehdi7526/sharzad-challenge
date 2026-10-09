'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { useHomeStore, HomeStoreProvider } from '../model/home-store';

const HomePanels = dynamic(() => import('./home-panels'), {
  ssr: false,
  loading: () => (
    <div className="panel-loading" role="status">
      در حال آماده‌سازی پنل…
    </div>
  ),
});
function Panels() {
  const panel = useHomeStore((state) => state.panel);
  return panel ? <HomePanels /> : null;
}
export function HomeProvider({ children }: { children: ReactNode }) {
  return (
    <HomeStoreProvider>
      {children}
      <Panels />
    </HomeStoreProvider>
  );
}
