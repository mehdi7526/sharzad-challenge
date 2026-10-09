import Image from 'next/image';
import { BackToTop } from '@/shared/components/back-to-top';
import { Flex } from '@/shared/components/flex';
import { Link } from '@/shared/components/typography';
import { footerLinks } from '@/shared/config/navigation';
import { DesktopFooterReveal } from './home-viewport';
export function HomeFooter() {
  return (
    <footer className="relative pt-17 pb-[calc(var(--footer-height)+24px)] desktop:h-75 desktop:p-0 desktop:[&>button]:hidden">
      <BackToTop targetId="home-content" />
    </footer>
  );
}
export function DesktopFooter() {
  return (
    <DesktopFooterReveal>
      <Image
        width={609}
        height={165}
        className="h-auto w-152.25"
        src="/assets/footer-picture.svg"
        alt="نمایی از خط آسمان تهران"
        loading="lazy"
      />
      <Flex
        component="nav"
        className="flex h-28.25 w-full items-center justify-center gap-12 bg-app-link px-6 text-app-white [&_a]:text-app-white"
        aria-label="پیوندهای پایین صفحه"
      >
        {footerLinks.map((link) => (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </Flex>
    </DesktopFooterReveal>
  );
}
