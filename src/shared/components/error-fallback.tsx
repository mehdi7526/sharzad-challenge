'use client';

import { Button } from './button';
import { Title, Paragraph, Text } from './typography';

import { useEffect, useTransition } from 'react';

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
    <main
      className={`
          grid min-h-[50vh] place-content-center justify-items-center gap-4 p-8
          text-center text-app-text [&_h1]:m-0 [&_div.ant-typography]:m-0 [&_button]:[font:inherit]
          [&_button]:px-6 [&_button]:py-3 [&_button]:border-0 [&_button]:rounded-xl
          [&_button]:bg-app-action [&_button]:text-app-white [&_button]:cursor-pointer
          [&_button:disabled]:opacity-60 [&_button:disabled]:cursor-wait
        `}
      aria-busy={isPending}
    >
      <Title level={1}>بارگذاری این بخش انجام نشد</Title>
      <Paragraph role="alert">خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.</Paragraph>
      <Button type="primary" onClick={() => startTransition(retry)} disabled={isPending}>
        {isPending ? 'در حال تلاش مجدد…' : 'تلاش دوباره'}
      </Button>
      {isPending ? <Text role="status">در حال بارگذاری…</Text> : null}
    </main>
  );
}
