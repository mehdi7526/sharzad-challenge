'use client';
import '@ant-design/v5-patch-for-react-19';
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
