import type { ReactNode } from 'react';
import { HomeHeader } from './home-header';
import { HomeNavigation } from './home-navigation';
import { HomeProvider } from './home-provider';
import { HomeViewport } from './home-viewport';
import { DesktopFooter } from './home-footer';
import type { HomepageData } from '../types';
export function HomeShell({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData?: HomepageData;
}) {
  return (
    <HomeProvider>
      <HomeViewport>
        <HomeHeader initialData={initialData} />
        {children}
        <DesktopFooter />
        <HomeNavigation />
      </HomeViewport>
    </HomeProvider>
  );
}
