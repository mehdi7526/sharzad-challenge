import type { ApiErrorResponse } from '@/shared/lib/api-response';

export type Service = {
  id: string;
  title: string;
  image: string;
  href: string;
  badge?: boolean;
  submenu?: { id: string; title: string }[];
};

export type HomepageData = {
  services: Service[];
  banner: { image: string; alt: string; serviceId: string };
};

export type ViewerData =
  | {
      signedIn: false;
      wallet: { label: string; balance: null };
      notifications: { unreadCount: 0 };
    }
  | {
      signedIn: true;
      wallet: { label: string; balance: number };
      notifications: { unreadCount: number };
    };

export type HomepageResult =
  | { ok: true; data: HomepageData }
  | { ok: false; status: number; message: string; details?: ApiErrorResponse['meta'] };
