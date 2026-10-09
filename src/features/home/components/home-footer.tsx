import Image from 'next/image';
import { BackToTop } from '@/shared/components/back-to-top';
import { Flex } from '@/shared/components/flex';
import { Link } from '@/shared/components/typography';
import { footerLinks } from '@/shared/config/navigation';
import styles from '@/shared/styles/home-footer.module.css';
import { DesktopFooterReveal } from './home-viewport';
export function HomeFooter() {
  return (
    <footer className={styles['site-footer']}>
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
        className={styles.cityscape}
        src="/assets/footer-picture.svg"
        alt="نمایی از خط آسمان تهران"
        loading="lazy"
      />
      <Flex component="nav" className={styles['footer-links']} aria-label="پیوندهای پایین صفحه">
        {footerLinks.map((link) => (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </Flex>
    </DesktopFooterReveal>
  );
}
