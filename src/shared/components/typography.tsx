'use client';

import { Typography as AntTypography } from 'antd';
import type { ComponentProps } from 'react';

export function Text({ className = '', ...props }: ComponentProps<typeof AntTypography.Text>) {
  return <AntTypography.Text className={`ui-text ${className}`} {...props} />;
}

export function Title({ className = '', ...props }: ComponentProps<typeof AntTypography.Title>) {
  return <AntTypography.Title className={`ui-title ${className}`} {...props} />;
}

export function Paragraph({
  className = '',
  ...props
}: ComponentProps<typeof AntTypography.Paragraph>) {
  return <AntTypography.Paragraph className={`ui-text ${className}`} {...props} />;
}

export function Link({ className = '', ...props }: ComponentProps<typeof AntTypography.Link>) {
  return <AntTypography.Link className={`ui-text ${className}`} {...props} />;
}
