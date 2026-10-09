'use client';

import {
  ArrowLeft2 as BaseArrowLeft2,
  ArrowDown2 as BaseArrowDown2,
  CloseCircle as BaseCloseCircle,
  NotificationBing as BaseNotificationBing,
  Scan as BaseScan,
  User as BaseUser,
  Profile as BaseProfile,
  Wallet2 as BaseWallet2,
  type Icon,
  type IconProps,
} from 'iconsax-react';

// Explicit defaults also work with React 19, which no longer applies function defaultProps.
function withDefaults(Component: Icon) {
  return function AppIcon({
    color = 'currentColor',
    size = 24,
    variant = 'Linear',
    ...props
  }: IconProps) {
    return <Component color={color} size={size} variant={variant} {...props} />;
  };
}

export const ArrowDown2 = withDefaults(BaseArrowDown2);
export const ArrowLeft2 = withDefaults(BaseArrowLeft2);
export const CloseCircle = withDefaults(BaseCloseCircle);
export const NotificationBing = withDefaults(BaseNotificationBing);
export const Scan = withDefaults(BaseScan);
export const Profile = withDefaults(BaseProfile);
export const User = withDefaults(BaseUser);
export const Wallet2 = withDefaults(BaseWallet2);
