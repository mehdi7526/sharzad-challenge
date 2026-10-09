import { describe, expect, it } from 'vitest';
import { parseHomepageData, parseViewerData } from '@/features/home/api/home-contract';
import { ApiContractError } from '@/shared/lib/api-response';
import type { HomepageData, ViewerData } from '@/features/home/types';

function homepage(): HomepageData {
  return {
    services: [
      {
        id: 'grocery',
        title: 'میوه و تره‌بار',
        image: '/grocery.webp',
        href: '/marketplace/2/grocery',
        submenu: [{ id: 'fruit', title: 'میوه' }],
      },
    ],
    banner: { image: '/banner.webp', alt: 'پیشنهاد ویژه', serviceId: 'grocery' },
  };
}

describe('homepage contract', () => {
  it('accepts a service and a banner referring to that service', () => {
    const data = homepage();
    expect(parseHomepageData(data)).toEqual(data);
  });

  it('accepts an empty list only with an empty banner service reference', () => {
    const data = { ...homepage(), services: [], banner: { ...homepage().banner, serviceId: '' } };
    expect(parseHomepageData(data)).toEqual(data);
    expect(() => parseHomepageData({ ...data, banner: homepage().banner })).toThrow(
      ApiContractError,
    );
  });

  it('rejects duplicate service IDs', () => {
    const data = homepage();
    expect(() =>
      parseHomepageData({ ...data, services: [...data.services, ...data.services] }),
    ).toThrow(ApiContractError);
  });

  it('rejects a banner referring to an unknown service', () => {
    const data = homepage();
    expect(() =>
      parseHomepageData({ ...data, banner: { ...data.banner, serviceId: 'missing' } }),
    ).toThrow(ApiContractError);
  });

  it.each(['javascript:alert(1)', '//example.com', 'http://example.com'])(
    'rejects unsupported service destination %s',
    (href) => {
      const data = homepage();
      expect(() =>
        parseHomepageData({ ...data, services: [{ ...data.services[0], href }] }),
      ).toThrow(ApiContractError);
    },
  );

  it('rejects malformed submenu entries', () => {
    const data = homepage();
    expect(() =>
      parseHomepageData({
        ...data,
        services: [{ ...data.services[0], submenu: [{ id: 'fruit', title: 42 }] }],
      }),
    ).toThrow(ApiContractError);
  });
});

describe('viewer contract', () => {
  const signedOut: ViewerData = {
    signedIn: false,
    wallet: { label: 'کیف پول', balance: null },
    notifications: { unreadCount: 0 },
  };
  const signedIn: ViewerData = {
    signedIn: true,
    wallet: { label: 'کیف پول', balance: 15000 },
    notifications: { unreadCount: 2 },
  };

  it.each([signedOut, signedIn])('accepts a consistent account (signedIn: $signedIn)', (data) => {
    expect(parseViewerData(data)).toEqual(data);
  });

  it('rejects wallet balance or notifications for a signed-out account', () => {
    expect(() =>
      parseViewerData({ ...signedOut, wallet: { label: 'کیف پول', balance: 10 } }),
    ).toThrow(ApiContractError);
    expect(() => parseViewerData({ ...signedOut, notifications: { unreadCount: 1 } })).toThrow(
      ApiContractError,
    );
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, '15000', null])(
    'rejects invalid signed-in balance %s',
    (balance) => {
      expect(() => parseViewerData({ ...signedIn, wallet: { label: 'کیف پول', balance } })).toThrow(
        ApiContractError,
      );
    },
  );

  it.each([-1, 1.5])('rejects invalid unread count %s', (unreadCount) => {
    expect(() => parseViewerData({ ...signedIn, notifications: { unreadCount } })).toThrow(
      ApiContractError,
    );
  });
});
