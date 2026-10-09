'use client';

import { Button as AntButton } from 'antd';
import type { ComponentProps } from 'react';

export type ButtonProps = ComponentProps<typeof AntButton>;

export function Button({ loading = false, disabled = false, ...props }: ButtonProps) {
  return (
    <AntButton
      htmlType="button"
      {...props}
      loading={loading}
      disabled={disabled || Boolean(loading)}
      aria-busy={Boolean(loading) || undefined}
    />
  );
}
