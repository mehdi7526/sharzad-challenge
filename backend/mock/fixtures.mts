import type { Service, HomepageData, ViewerData } from '../../src/features/home/types/index.ts';

const services: Service[] = [
  {
    id: 'grocery',
    title: 'میوه و تره‌بار',
    image: '/assets/services/grocery.webp',
    href: '/marketplace/2/grocery',
  },
  {
    id: 'zero-inflation',
    title: 'تورم صفر',
    image: '/assets/services/zero-inflation.webp',
    href: '#',
  },
  {
    id: 'shahrvand',
    title: 'فروشگاه شهروند',
    image: '/assets/services/shahrvand.webp',
    href: '/marketplace/1/shahrvand',
  },
  { id: 'traffic', title: 'طرح ترافیک', image: '/assets/services/traffic.webp', href: '#' },
  {
    id: 'transit',
    title: 'مترو و اتوبوس',
    image: '/assets/services/transit.webp',
    href: '/abt-ticket',
  },
  {
    id: 'nomand',
    title: 'نوماند',
    image: '/assets/services/nomand.webp',
    href: '/marketplace/3/nomand',
  },
  { id: 'property', title: 'عوارض ملک', image: '/assets/services/property.webp', href: '/urban' },
  { id: 'car-tax', title: 'عوارض خودرو', image: '/assets/services/car-tax.webp', href: '#' },
  {
    id: 'inspection',
    title: 'معاینه فنی',
    image: '/assets/services/inspection.webp',
    href: '/technical-diagnosis',
  },
  {
    id: '137',
    title: '۱۳۷+',
    image: '/assets/services/137.webp',
    href: '#',
    badge: true,
    submenu: [
      { id: 'message', title: 'پیام به ۱۳۷+' },
      { id: 'my-messages', title: 'پیام‌های ۱۳۷+ من' },
    ],
  },
  {
    id: 'taxi',
    title: 'کرایه تاکسی',
    image: '/assets/services/taxi.webp',
    href: '/taxi-passenger',
  },
  { id: 'scooter', title: 'اسکوتر کن', image: '/assets/services/scooter.webp', href: '#' },
  { id: 'khanehriz', title: 'خانه‌ریز', image: '/assets/services/khanehriz.webp', href: '#' },
  {
    id: 'bicycle',
    title: 'دوچرخه',
    image: '/assets/services/bicycle.webp',
    href: '/marketplace/0/bicycle/stations',
  },
  { id: 'parking', title: 'پارک حاشیه‌ای', image: '/assets/services/parking.webp', href: '#' },
  {
    id: 'tv',
    title: 'تلویزیون',
    image: '/assets/services/tv.webp',
    href: 'https://telewebion.net/live/irinn',
  },
  {
    id: 'kids',
    title: 'کودک',
    image: '/assets/services/kids.webp',
    href: 'https://telewebion.ir/kids',
  },
  { id: 'deceased', title: 'جستجوی متوفی', image: '/assets/services/deceased.webp', href: '#' },
  { id: 'sports', title: 'ورزش', image: '/assets/services/sports.webp', href: '#' },
  {
    id: 'tehran360',
    title: 'تهران مجازی',
    image: '/assets/services/tehran360.webp',
    href: '#',
    badge: true,
    submenu: [
      { id: 'park', title: 'پارک نما' },
      { id: '3d', title: 'تهران سه‌بعدی' },
      { id: 'tourism', title: 'گردشگری' },
      { id: 'police', title: 'پلیس راهور' },
      { id: 'transport', title: 'حمل و نقل عمومی' },
    ],
  },
  {
    id: 'hamkara',
    title: 'باشگاه همکارا',
    image: '/assets/services/hamkara.webp',
    href: 'https://hamkara.club/nd/?login=true',
  },
  { id: 'carpool', title: 'هم‌پیمایی', image: '/assets/services/carpool.webp', href: '/forms/hov' },
];

export const homeFixture: HomepageData = {
  services,
  banner: {
    image: '/assets/traffic-banner.jpg',
    alt: 'خرید طرح ترافیک با صرفه؛ پرداخت هزینه فقط بابت مدت زمانی که در طرح بوده‌اید',
    serviceId: 'traffic',
  },
};

export const viewerFixture: ViewerData = {
  signedIn: false,
  wallet: { label: 'کیف پول', balance: null },
  notifications: { unreadCount: 0 },
};

export const signedInViewerFixture: ViewerData = {
  signedIn: true,
  wallet: { label: 'کیف پول', balance: 125000 },
  notifications: { unreadCount: 2 },
};
