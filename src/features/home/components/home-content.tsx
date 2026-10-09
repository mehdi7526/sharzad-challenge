import type { ReactNode } from 'react';
import { HomeScrollContent } from './home-viewport';
import { HomeFooter } from './home-footer';
import { PromoBanner } from './promo-banner';
import { WalletCard } from './wallet-card';
import type { HomepageData } from '../types';

export function HomeContent({
  children,
  initialData,
  initialError,
}: {
  children: ReactNode;
  initialData?: HomepageData;
  initialError?: string;
}) {
  return (
    <>
      <WalletCard />
      <HomeScrollContent>
        <PromoBanner initialData={initialData} initialError={initialError} />
        {children}
        <HomeFooter />
      </HomeScrollContent>
    </>
  );
}
