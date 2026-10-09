import { ApiContractError } from '@/shared/lib/api-error';
import type { HomepageData, Service, ViewerData } from '../types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafeUrl(value: string) {
  return (
    value === '#' ||
    (value.startsWith('/') && !value.startsWith('//')) ||
    value.startsWith('https://')
  );
}

function parseSubmenu(value: unknown): NonNullable<Service['submenu']> {
  if (!Array.isArray(value)) throw new ApiContractError('Invalid service submenu');
  return value.map((item: unknown) => {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      !item.id ||
      typeof item.title !== 'string'
    ) {
      throw new ApiContractError('Invalid service submenu item');
    }
    return { id: item.id, title: item.title };
  });
}

function parseService(value: unknown): Service {
  if (!isRecord(value)) throw new ApiContractError('Invalid homepage service');
  const { id, title, image, href, badge, submenu } = value;
  if (
    typeof id !== 'string' ||
    !id ||
    typeof title !== 'string' ||
    typeof image !== 'string' ||
    !isSafeUrl(image) ||
    typeof href !== 'string' ||
    !isSafeUrl(href) ||
    (badge !== undefined && typeof badge !== 'boolean')
  )
    throw new ApiContractError('Invalid homepage service');
  return {
    id,
    title,
    image,
    href,
    badge,
    submenu: submenu === undefined ? undefined : parseSubmenu(submenu),
  };
}

export function parseHomepageData(value: unknown): HomepageData {
  if (!isRecord(value) || !Array.isArray(value.services) || !isRecord(value.banner)) {
    throw new ApiContractError('Invalid homepage response');
  }
  const { image, alt, serviceId } = value.banner;
  if (
    typeof image !== 'string' ||
    !isSafeUrl(image) ||
    typeof alt !== 'string' ||
    typeof serviceId !== 'string'
  ) {
    throw new ApiContractError('Invalid homepage banner');
  }
  const services = value.services.map(parseService);
  const ids = new Set(services.map((service) => service.id));
  if (
    ids.size !== services.length ||
    (services.length > 0 && !ids.has(serviceId)) ||
    (services.length === 0 && serviceId !== '')
  ) {
    throw new ApiContractError('Invalid homepage service reference');
  }
  return { services, banner: { image, alt, serviceId } };
}

export function parseViewerData(value: unknown): ViewerData {
  if (!isRecord(value) || !isRecord(value.wallet) || !isRecord(value.notifications)) {
    throw new ApiContractError('Invalid viewer response');
  }
  const { signedIn } = value;
  const { label, balance } = value.wallet;
  const { unreadCount } = value.notifications;
  if (
    typeof label !== 'string' ||
    typeof unreadCount !== 'number' ||
    !Number.isInteger(unreadCount) ||
    unreadCount < 0
  ) {
    throw new ApiContractError('Invalid viewer response');
  }
  if (signedIn === false && balance === null && unreadCount === 0) {
    return { signedIn, wallet: { label, balance }, notifications: { unreadCount: 0 } };
  }
  if (
    signedIn === true &&
    typeof balance === 'number' &&
    Number.isFinite(balance) &&
    balance >= 0
  ) {
    return { signedIn, wallet: { label, balance }, notifications: { unreadCount } };
  }
  throw new ApiContractError('Inconsistent viewer state');
}
