import type { ThemeConfig } from 'antd';
import { palette } from './palette';

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: palette.primary,
    colorText: palette.text,
    fontFamily: 'var(--font-iran-yekan), Arial, sans-serif',
    borderRadius: 14,
    controlHeight: 44,
  },
};
