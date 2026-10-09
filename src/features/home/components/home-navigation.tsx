'use client';
import Image from 'next/image';
import { Scan } from '@/shared/components/icons';
import { ActionButton } from '@/shared/components/action-button';
import { Link, Text } from '@/shared/components/typography';
import { useHomeStore } from '../model/home-store';
export function HomeNavigation() {
  const setPanel = useHomeStore((state) => state.setPanel);
  return (
    <nav
      className={`
          absolute bottom-[max(20px,env(safe-area-inset-bottom))] left-1/2 z-4 flex h-12
          w-[min(calc(100%-46px),578px)] items-center justify-around rounded-xl bg-app-white
          transform-[translateX(-50%)] shadow-[0_8px_12px_var(--color-shadow)]
          before:pointer-events-none before:absolute before:-z-1 before:inset-[-24px_-24px_-20px]
          before:content-[''] before:[background:linear-gradient(transparent,var(--color-white))]
          squircle:rounded-[30px] squircle:[corner-shape:squircle] desktop:hidden
        `}
      aria-label="ناوبری اصلی"
    >
      <ActionButton
        className="flex flex-1 items-center justify-center gap-1 text-[12px] font-bold text-app-ink [&_img]:h-6 [&_img]:w-6"
        onClick={() => setPanel('wallet')}
      >
        <Image src="/assets/nav-wallet.png" alt="" width={24} height={24} />
        <Text>کیف پول</Text>
      </ActionButton>
      <Link
        className={`
          grid h-17.5 w-17.5 flex-none place-items-center rounded-2xl border-4
          border-app-white bg-app-scanner text-app-link squircle:rounded-[50%]
          squircle:[corner-shape:squircle]
        `}
        aria-label="اسکن"
        href="https://web.shahrzadcity.ir/qr-payment"
      >
        <Scan size={32} variant="Bulk" />
      </Link>
      <Link
        className="flex flex-1 items-center justify-center gap-1 text-[12px] font-bold text-app-ink [&_img]:h-6 [&_img]:w-6"
        href="https://web.shahrzadcity.ir/shahrzad-services"
      >
        <Image src="/assets/nav-services.png" alt="" width={24} height={24} />
        <Text>خدمات</Text>
      </Link>
    </nav>
  );
}
