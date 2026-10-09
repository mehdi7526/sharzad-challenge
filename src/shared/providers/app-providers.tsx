'use client';
import { App, ConfigProvider } from 'antd';
import type { ReactNode } from 'react';
import { appTheme } from '../config/theme';
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider direction="rtl" theme={appTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
