'use client';

import '@/shared/styles/globals.css';
import { palette, paletteStyle } from '@/shared/config/palette';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ErrorFallback, type ErrorFallbackProps } from '@/shared/components/error-fallback';

export default function GlobalError(props: ErrorFallbackProps) {
  return (
    <html lang="fa" dir="rtl" style={paletteStyle}>
      <head>
        <title>خطای برنامه | شهرزاد</title>
        <style>{'@layer theme, base, antd, shared, components, utilities;'}</style>
      </head>
      <body
        style={{ margin: 0, background: palette.errorBackground, fontFamily: 'Arial, sans-serif' }}
      >
        <AntdRegistry layer>
          <ErrorFallback {...props} />
        </AntdRegistry>
      </body>
    </html>
  );
}
