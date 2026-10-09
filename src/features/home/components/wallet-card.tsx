'use client';
import { ArrowLeft2 } from '@/shared/components/icons';
import { ActionButton } from '@/shared/components/action-button';
import { Text } from '@/shared/components/typography';
import { useHomeStore } from '../model/home-store';
import { useViewer } from '../api/use-viewer';
import styles from '@/shared/styles/home-shell.module.css';
export function WalletCard({ desktop = false }: { desktop?: boolean }) {
  const setPanel = useHomeStore((state) => state.setPanel);
  const { data } = useViewer();
  const label = data?.wallet.label ?? 'کیف پول';
  return (
    <section
      className={`${styles['wallet-card']} ${styles[desktop ? 'desktop-wallet' : 'mobile-wallet']}`}
      aria-label="کیف پول"
    >
      <Text className={styles['wallet-title']}>
        {label}
        {desktop ? ':' : ''}
      </Text>
      <ActionButton className={styles['wallet-action']} onClick={() => setPanel('wallet')}>
        <Text>{desktop ? 'مشاهده' : 'مشاهده موجودی'}</Text>
        <ArrowLeft2 size={20} />
      </ActionButton>
    </section>
  );
}
