'use client';
import type { Service } from '../types';
import { useHomeStore } from '../model/home-store';

const referenceOrigin = 'https://web.shahrzadcity.ir';

export function serviceDestination(service: Service): string | null {
  if (service.href.startsWith('/') && !service.href.startsWith('//')) {
    return new URL(service.href, referenceOrigin).href;
  }
  if (service.href.startsWith('https://')) return service.href;
  return null;
}

export function useOpenService() {
  const showServicePanel = useHomeStore((state) => state.openService);
  return (service: Service) => {
    const destination = serviceDestination(service);
    if (destination) {
      window.location.assign(destination);
      return;
    }
    showServicePanel(service);
  };
}
