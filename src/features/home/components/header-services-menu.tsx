'use client';
import { useState } from 'react';
import { Dropdown, type MenuItems } from '@/shared/components/dropdown';
import { ActionButton } from '@/shared/components/action-button';
import { ArrowDown2 } from '@/shared/components/icons';
import type { HomepageResult } from '../types';
import { useHomepage } from '../api/use-homepage';
import { useOpenService } from '../model/use-open-service';

export function HeaderServicesMenu({ initialResult }: { initialResult?: HomepageResult }) {
  const { data } = useHomepage(initialResult);
  const services = data?.services ?? [];
  const items: MenuItems = services.map((service) => ({
    key: service.id,
    label: service.title,
    popupClassName:
      '[&_.ant-dropdown-menu]:rounded-sm [&_.ant-dropdown-menu]:px-0 [&_.ant-dropdown-menu]:py-1 [&_.ant-dropdown-menu-item]:rounded-none [&_.ant-dropdown-menu-item]:px-3 [&_.ant-dropdown-menu-item]:py-1.25 [&_.ant-dropdown-menu-item]:leading-5.5 [&_.ant-dropdown-menu-item]:font-medium',
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
      overlayClassName={
        'w-75 max-h-[80vh] overflow-y-auto rounded-sm font-medium [&_.ant-dropdown-menu]:rounded-sm [&_.ant-dropdown-menu]:px-0 [&_.ant-dropdown-menu]:py-1 [&_.ant-dropdown-menu-item]:rounded-none [&_.ant-dropdown-menu-item]:px-3 [&_.ant-dropdown-menu-item]:py-1.25 [&_.ant-dropdown-menu-item]:leading-5.5 [&_.ant-dropdown-menu-item]:font-medium [&_.ant-dropdown-menu-submenu-title]:rounded-none [&_.ant-dropdown-menu-submenu-title]:px-3 [&_.ant-dropdown-menu-submenu-title]:py-1.25 [&_.ant-dropdown-menu-submenu-title]:leading-5.5 [&_.ant-dropdown-menu-submenu-title]:font-medium'
      }
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
        className="desktop:flex desktop:items-center desktop:gap-2 desktop:text-app-white desktop:text-[14px] desktop:font-bold"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        خدمات شهرزاد
        <ArrowDown2 size={16} />
      </ActionButton>
    </Dropdown>
  );
}
