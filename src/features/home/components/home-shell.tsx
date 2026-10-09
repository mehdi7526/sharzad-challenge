import type { ReactNode } from 'react';
import { HomeHeader } from './home-header';
import { HomeNavigation } from './home-navigation';
import { HomeProvider } from './home-provider';
import { HomeViewport } from './home-viewport';
import { DesktopFooter } from './home-footer';
import type { HomepageResult } from '../types';
export function HomeShell({
  children,
  initialResult,
}: {
  children: ReactNode;
  initialResult?: HomepageResult;
}) {
  return (
    <HomeProvider>
      <HomeViewport>
        <HomeHeader initialResult={initialResult} />
        {children}
        <DesktopFooter />
        <HomeNavigation />
      </HomeViewport>
    </HomeProvider>
  );
}
