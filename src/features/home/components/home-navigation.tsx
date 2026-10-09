'use client';
import Image from 'next/image';
import { Scan } from '@/shared/components/icons';
import { ActionButton } from '@/shared/components/action-button';
import { Link, Text } from '@/shared/components/typography';
import { useHomeStore } from '../model/home-store';
import styles from '@/shared/styles/home-navigation.module.css';
export function HomeNavigation() {
  const setPanel = useHomeStore((state) => state.setPanel);
  return (
    <nav className={styles['bottom-nav']} aria-label="ناوبری اصلی">
      <ActionButton className={styles['bottom-nav-item']} onClick={() => setPanel('wallet')}>
        <Image src="/assets/nav-wallet.png" alt="" width={24} height={24} />
        <Text>کیف پول</Text>
      </ActionButton>
      <Link
        className={styles['scanner-button']}
        aria-label="اسکن"
        href="https://web.shahrzadcity.ir/qr-payment"
      >
        <Scan size={32} variant="Bulk" />
      </Link>
      <Link
        className={styles['bottom-nav-item']}
        href="https://web.shahrzadcity.ir/shahrzad-services"
      >
        <Image src="/assets/nav-services.png" alt="" width={24} height={24} />
        <Text>خدمات</Text>
      </Link>
    </nav>
  );
}
