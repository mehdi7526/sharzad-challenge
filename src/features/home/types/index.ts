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

export type ViewerData = {
  signedIn: boolean;
  wallet: { label: string; balance: number | null };
  notifications: { unreadCount: number };
};
