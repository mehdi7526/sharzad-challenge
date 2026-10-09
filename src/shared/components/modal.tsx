'use client';

import { Modal as AntModal, type ModalProps } from 'antd';
import { CloseCircle } from '@/shared/components/icons';

export function Modal(props: ModalProps) {
  return <AntModal centered footer={null} closeIcon={<CloseCircle size={22} />} {...props} />;
}
