'use client';
import Image from 'next/image';
import { Scan, NotificationBing, Profile } from '@/shared/components/icons';
import { ActionButton } from '@/shared/components/action-button';
import { Flex } from '@/shared/components/flex';
import { IconButton } from '@/shared/components/icon-button';
import { Link } from '@/shared/components/typography';
import { WalletCard } from './wallet-card';
import { HeaderServicesMenu } from './header-services-menu';
import styles from '@/shared/styles/home-shell.module.css';
import type { HomepageResult } from '../types';
import { useHomeStore } from '../model/home-store';
export function HomeHeader({ initialResult }: { initialResult?: HomepageResult }) {
  const compact = useHomeStore((state) => state.compactHeader);
  const setPanel = useHomeStore((state) => state.setPanel);
  return (
    <header className={styles['top-header']}>
      <IconButton
        className={`${styles['header-icon']} ${styles['header-profile']}`}
        aria-label="حساب کاربری"
        onClick={() => setPanel('profile')}
      >
        <span className={styles['profile-mobile']}>
          <Profile size={24} variant="Outline" />
        </span>
        <span className={styles['profile-desktop']}>
          <Profile size={20} variant="Bulk" />
        </span>
      </IconButton>
      <ActionButton
        className={styles['brand-button']}
        aria-label="صفحه اصلی"
        aria-hidden={compact}
        tabIndex={compact ? -1 : 0}
        onClick={() =>
          document.getElementById('home-content')?.scrollTo({ top: 0, behavior: 'smooth' })
        }
      >
        <Image
          className={styles['brand-logo']}
          src="/assets/logo.svg"
          alt="شهرزاد"
          width={96}
          height={32}
        />
      </ActionButton>
      <nav className={styles['desktop-header-links']} aria-label="پیوندهای اصلی">
        <HeaderServicesMenu initialResult={initialResult} />
        <Link href="https://web.shahrzadcity.ir/faq">سوالات متداول</Link>
        <Link href="https://web.shahrzadcity.ir/about-shahrzad">درباره شهرزاد</Link>
      </nav>
      <WalletCard desktop />
      <Flex className={styles['mobile-header-actions']}>
        <IconButton
          className={`${styles['header-icon']} ${styles['header-notification']}`}
          aria-label="اعلان‌ها"
          onClick={() => setPanel('notifications')}
        >
          <NotificationBing size={24} variant="Outline" />
        </IconButton>
        <Link
          className={`${styles['header-icon']} ${styles['header-scan']}`}
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
