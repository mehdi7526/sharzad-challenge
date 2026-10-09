'use client';
import Image from 'next/image';
import { useEffect, type ReactNode } from 'react';
import { useHomeStore } from '../model/home-store';
import styles from '@/shared/styles/home-shell.module.css';
import footerStyles from '@/shared/styles/home-footer.module.css';

function MobileFooterBackground() {
  const remainingScroll = useHomeStore((state) => state.remainingScroll);
  return (
    <div
      className={footerStyles['footer-background']}
      style={{
        transform: `translateY(${remainingScroll === null ? '100%' : `min(100%, ${remainingScroll}px)`})`,
      }}
      aria-hidden="true"
    >
      <Image src="/assets/footer-background-mobile.svg" alt="" width={388} height={240} />
    </div>
  );
}

export function HomeViewport({ children }: { children: ReactNode }) {
  const compact = useHomeStore((state) => state.compactHeader);
  return (
    <div className={`${styles['site-shell']} ${compact ? styles.compact : ''}`} dir="rtl">
      <div className={styles['header-wave']} aria-hidden="true" />
      {children}
      <MobileFooterBackground />
    </div>
  );
}

export function HomeScrollContent({ children }: { children: ReactNode }) {
  const setScrollState = useHomeStore((state) => state.setScrollState);
  useEffect(() => {
    const main = document.getElementById('home-content');
    const content = document.getElementById('home-scroll-body');
    if (!main || !content) return;
    const sync = () =>
      setScrollState(
        window.innerWidth < 1024 && main.scrollTop > 0,
        Math.max(0, main.scrollHeight - main.clientHeight - main.scrollTop),
      );
    const observer = new ResizeObserver(sync);
    observer.observe(main);
    observer.observe(content);
    window.addEventListener('resize', sync);
    sync();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [setScrollState]);
  return (
    <main
      id="home-content"
      className={styles['page-content']}
      onScroll={(event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        setScrollState(
          window.innerWidth < 1024 && scrollTop > 0,
          Math.max(0, scrollHeight - clientHeight - scrollTop),
        );
      }}
    >
      <div id="home-scroll-body">{children}</div>
    </main>
  );
}

export function DesktopFooterReveal({ children }: { children: ReactNode }) {
  const atEnd = useHomeStore(
    (state) => state.remainingScroll !== null && state.remainingScroll <= 1,
  );
  return (
    <footer
      className={`${footerStyles['desktop-footer']} ${atEnd ? footerStyles['footer-visible'] : ''}`}
      aria-hidden={!atEnd}
      inert={!atEnd}
    >
      {children}
    </footer>
  );
}
