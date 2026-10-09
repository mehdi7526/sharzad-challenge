import { describe, expect, it } from 'vitest';
import { serviceDestination } from '@/features/home/model/use-open-service';
import type { Service } from '@/features/home/types';

function service(href: string): Service {
  return { id: 'grocery', title: 'میوه و تره‌بار', image: '/grocery.webp', href };
}

describe('service destination', () => {
  it('resolves a reference-site path and preserves its query', () => {
    expect(serviceDestination(service('/marketplace/2/grocery?category=fruit'))).toBe(
      'https://web.shahrzadcity.ir/marketplace/2/grocery?category=fruit',
    );
  });

  it('preserves an external HTTPS destination', () => {
    expect(serviceDestination(service('https://example.com/service'))).toBe(
      'https://example.com/service',
    );
  });

  it.each(['#', '//example.com/service', 'javascript:alert(1)', 'http://example.com'])(
    'keeps %s out of external navigation',
    (href) => {
      expect(serviceDestination(service(href))).toBeNull();
    },
  );
});
