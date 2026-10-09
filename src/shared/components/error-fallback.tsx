'use client';

import { Button } from './button';
import { Title, Paragraph, Text } from './typography';

import { useEffect, useTransition } from 'react';
import styles from '../styles/error-fallback.module.css';

export type ErrorFallbackProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export function ErrorFallback({ error, retry }: ErrorFallbackProps) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error('Unexpected rendering error', error);
  }, [error]);

  return (
    <main className={styles.fallback} aria-busy={isPending}>
      <Title level={1}>بارگذاری این بخش انجام نشد</Title>
      <Paragraph role="alert">خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.</Paragraph>
      <Button type="primary" onClick={() => startTransition(retry)} disabled={isPending}>
        {isPending ? 'در حال تلاش مجدد…' : 'تلاش دوباره'}
      </Button>
      {isPending ? <Text role="status">در حال بارگذاری…</Text> : null}
    </main>
  );
}
