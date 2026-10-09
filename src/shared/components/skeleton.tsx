'use client';

import { Skeleton as AntSkeleton } from 'antd';
import type { ComponentProps } from 'react';

export function SkeletonAvatar(props: ComponentProps<typeof AntSkeleton.Avatar>) {
  return <AntSkeleton.Avatar {...props} />;
}

export function SkeletonInput(props: ComponentProps<typeof AntSkeleton.Input>) {
  return <AntSkeleton.Input {...props} />;
}
