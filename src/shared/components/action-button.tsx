'use client';

import { Button, type ButtonProps } from './button';

export type ActionButtonProps = ButtonProps;

export function ActionButton({ className = '', ...props }: ActionButtonProps) {
  return <Button type="text" className={`ui-action ${className}`} {...props} />;
}
