'use client';
import { Button } from '@/shared/components/button';
import styles from '../styles/back-to-top.module.css';
export function BackToTop({ targetId }: { targetId?: string }) {
  return (
    <Button
      className={styles.root}
      onClick={() =>
        (targetId ? document.getElementById(targetId) : window)?.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    >
      بازگشت به بالا
    </Button>
  );
}
