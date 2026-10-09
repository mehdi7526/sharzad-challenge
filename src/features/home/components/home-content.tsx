import type { ReactNode } from 'react';
import { HomeScrollContent } from './home-viewport';
import { HomeFooter } from './home-footer';
import { PromoBanner } from './promo-banner';
import { WalletCard } from './wallet-card';
import type { HomepageResult } from '../types';

export function HomeContent({
  children,
  initialResult,
}: {
  children: ReactNode;
  initialResult?: HomepageResult;
}) {
  return (
    <>
      <WalletCard />
      <HomeScrollContent>
        <PromoBanner initialResult={initialResult} />
        {children}
        <HomeFooter />
      </HomeScrollContent>
    </>
  );
}
