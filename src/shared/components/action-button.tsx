'use client';

import { Button, type ButtonProps } from './button';
import styles from '../styles/primitives.module.css';

export type ActionButtonProps = ButtonProps;

export function ActionButton({ className = '', ...props }: ActionButtonProps) {
  return <Button type="text" className={`${styles.action} ${className}`} {...props} />;
}
