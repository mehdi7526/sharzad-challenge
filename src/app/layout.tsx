import type { Metadata, Viewport } from 'next';
import { iranYekan } from './_fonts';
import { palette, paletteStyle } from '@/shared/config/palette';
import { AppProviders } from '@/shared/providers/app-providers';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@/shared/styles/globals.css';

export const metadata: Metadata = {
  title: 'شهرزاد | دستیار هوشمند شهر تو',
  description: 'دسترسی یکپارچه به خدمات شهری تهران در سوپر اپلیکیشن شهرزاد.',
  applicationName: 'شهرزاد',
  keywords: ['شهرزاد', 'خدمات شهری', 'تهران', 'شهرداری تهران'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'شهرزاد',
    description: 'خدمات شهری شهرزاد',
    locale: 'fa_IR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: palette.header,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={iranYekan.variable} style={paletteStyle}>
      <body>
        <AntdRegistry layer>
          <AppProviders>{children}</AppProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}
