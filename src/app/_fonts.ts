import localFont from 'next/font/local';

export const iranYekan = localFont({
  src: [
    { path: './fonts/iranyekan-regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/iranyekan-medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/iranyekan-demibold.ttf', weight: '600', style: 'normal' },
    { path: './fonts/iranyekan-bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-iran-yekan',
  fallback: ['Arial', 'sans-serif'],
});
