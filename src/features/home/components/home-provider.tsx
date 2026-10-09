'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { useHomeStore, HomeStoreProvider } from '../model/home-store';

const HomePanels = dynamic(() => import('./home-panels'), {
  ssr: false,
  loading: () => (
    <div
      className="fixed bottom-25 left-1/2 z-1000 rounded-[14px] bg-app-white px-6 py-3.5 transform-[translateX(-50%)] shadow-[0_4px_24px_var(--color-shadowsoft)]"
      role="status"
    >
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
