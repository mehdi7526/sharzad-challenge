'use client';
import { useState } from 'react';
import { Dropdown, type MenuItems } from '@/shared/components/dropdown';
import { ActionButton } from '@/shared/components/action-button';
import { ArrowDown2 } from '@/shared/components/icons';
import type { HomepageResult } from '../types';
import { useHomepage } from '../api/use-homepage';
import { useOpenService } from '../model/use-open-service';
import styles from '@/shared/styles/home-services.module.css';

export function HeaderServicesMenu({ initialResult }: { initialResult?: HomepageResult }) {
  const { data } = useHomepage(initialResult);
  const services = data?.services ?? [];
  const items: MenuItems = services.map((service) => ({
    key: service.id,
    label: service.title,
    popupClassName: styles['services-submenu'],
    children: service.submenu?.map((item) => ({
      key: `${service.id}:${item.id}`,
      label: item.title,
    })),
  }));
  const [open, setOpen] = useState(false);
  const openService = useOpenService();
  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      overlayClassName={styles['services-dropdown']}
      menu={{
        items,
        onClick: ({ key }) => {
          const service = services.find((item) => item.id === key.split(':')[0]);
          if (!service) return;
          setOpen(false);
          openService(service);
        },
      }}
    >
      <ActionButton
        className={styles['services-trigger']}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        خدمات شهرزاد
        <ArrowDown2 size={16} />
      </ActionButton>
    </Dropdown>
  );
}
