'use client';
import Image from 'next/image';
import { Scan, NotificationBing, Profile } from '@/shared/components/icons';
import { ActionButton } from '@/shared/components/action-button';
import { Flex } from '@/shared/components/flex';
import { IconButton } from '@/shared/components/icon-button';
import { Link } from '@/shared/components/typography';
import { WalletCard } from './wallet-card';
import { HeaderServicesMenu } from './header-services-menu';
import type { HomepageData } from '../types';
import { useHomeStore } from '../model/home-store';
export function HomeHeader({ initialData }: { initialData?: HomepageData }) {
  const compact = useHomeStore((state) => state.compactHeader);
  const setPanel = useHomeStore((state) => state.setPanel);
  return (
    <header
      className={`
          relative z-2 flex h-21 flex-none items-center px-5 pt-4 pb-5
          text-app-white desktop:mx-auto desktop:mb-4.5 desktop:h-17.5 desktop:max-w-300
          desktop:p-0 desktop-tight:mx-6
        `}
    >
      <IconButton
        className={`
          grid h-6 w-6 place-items-center text-app-white ml-auto desktop:order-2
          desktop:ml-0 desktop:h-12 desktop:w-11.5 desktop:rounded-xl desktop:border
          desktop:border-app-white-border desktop:bg-app-white-overlay
          desktop:squircle:rounded-[30px] desktop:squircle:[corner-shape:squircle]
        `}
        aria-label="حساب کاربری"
        onClick={() => setPanel('profile')}
      >
        <span className="desktop:hidden">
          <Profile size={24} variant="Outline" />
        </span>
        <span className="hidden desktop:block">
          <Profile size={20} variant="Bulk" />
        </span>
      </IconButton>
      <ActionButton
        className={`
          absolute top-6 left-1/2 transform-[translateX(-50%)]
          mobile:transition-[transform,opacity,filter] mobile:duration-200
          mobile:ease-[ease-in-out] mobile:group-data-[compact=true]/home:opacity-0
          mobile:group-data-[compact=true]/home:blur-xs
          mobile:group-data-[compact=true]/home:pointer-events-none
          mobile:group-data-[compact=true]/home:transform-[translateX(-50%)_scale(0.5)]
          desktop:static desktop:-order-2 desktop:transform-none
        `}
        aria-label="صفحه اصلی"
        aria-hidden={compact}
        tabIndex={compact ? -1 : 0}
        onClick={() =>
          document.getElementById('home-content')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      >
        <Image
          className="block h-8 w-24 filter-[brightness(0)_invert(1)]"
          src="/assets/logo.svg"
          alt="شهرزاد"
          width={96}
          height={32}
        />
      </ActionButton>
      <nav
        className="hidden desktop:-order-1 desktop:flex desktop:items-center desktop:gap-10 desktop:px-14 desktop:text-[14px] desktop:font-bold [&_a]:text-app-white"
        aria-label="پیوندهای اصلی"
      >
        <HeaderServicesMenu initialData={initialData} />
        <Link href="https://web.shahrzadcity.ir/faq">سوالات متداول</Link>
        <Link href="https://web.shahrzadcity.ir/about-shahrzad">درباره شهرزاد</Link>
      </nav>
      <WalletCard desktop />
      <Flex className="flex items-center gap-4 desktop:hidden">
        <IconButton
          className={`
          grid h-6 w-6 place-items-center text-app-white
          mobile:[transition-property:transform] mobile:duration-200 mobile:ease-[ease-in-out]
          mobile:group-data-[compact=true]/home:transform-[translateX(-40px)]
        `}
          aria-label="اعلان‌ها"
          onClick={() => setPanel('notifications')}
        >
          <NotificationBing size={24} variant="Outline" />
        </IconButton>
        <Link
          className={`
          grid h-6 w-6 place-items-center text-app-white
          mobile:transition-[transform,opacity,filter] mobile:duration-200
          mobile:ease-[ease-in-out] mobile:group-data-[compact=true]/home:opacity-0
          mobile:group-data-[compact=true]/home:blur-xs
          mobile:group-data-[compact=true]/home:pointer-events-none
          mobile:group-data-[compact=true]/home:transform-[scale(0.5)]
        `}
          href="https://web.shahrzadcity.ir/qr-payment"
          aria-label="اسکن کد"
          aria-hidden={compact}
          tabIndex={compact ? -1 : 0}
        >
          <Scan size={24} variant="Outline" />
        </Link>
      </Flex>
    </header>
  );
}
