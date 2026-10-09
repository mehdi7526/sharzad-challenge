'use client';
import Image from 'next/image';
import { useEffect, type ReactNode } from 'react';
import { useHomeStore } from '../model/home-store';

function MobileFooterBackground() {
  const remainingScroll = useHomeStore((state) => state.remainingScroll);
  return (
    <div
      className={`
          pointer-events-none absolute bottom-0 left-0 z-3 h-(--footer-height) w-full
          overflow-hidden desktop:hidden [&_img]:absolute [&_img]:bottom-0 [&_img]:h-auto
          [&_img]:w-full
        `}
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
    <div
      className="group/home relative isolate mx-px flex h-dvh flex-col overflow-hidden bg-app-white [--footer-height:calc((100vw-2px)*232/375)] desktop:mx-0 desktop:block"
      data-compact={compact}
      dir="rtl"
    >
      <div
        className={`
          absolute -z-1 inset-[0_0_auto] h-50 overflow-hidden rounded-b-2xl
          [transition-property:transform] duration-200 ease-[ease-in-out] before:absolute
          before:inset-0 before:content-['']
          before:[background:url('/assets/header-background-mobile.svg')_center/cover_no-repeat]
          before:[transition-property:transform] before:duration-200 before:ease-[ease-in-out]
          mobile:group-data-[compact=true]/home:transform-[translateY(-80px)]
          mobile:group-data-[compact=true]/home:before:transform-[translateY(80px)]
          desktop:h-34
          desktop:[background:url('/assets/header-background.svg')_center/cover_no-repeat]
          desktop:before:hidden
        `}
        aria-hidden="true"
      />
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
      className={`
          relative z-1 mx-4 min-h-0 flex-1 overflow-y-auto rounded-2xl p-3
          scrollbar-none [&::-webkit-scrollbar]:hidden
          [background:linear-gradient(var(--color-white)_0%,var(--color-white)_calc(100%-var(--footer-height)),transparent_calc(100%-var(--footer-height)))]
          text-app-ink mobile:[transition-property:transform] mobile:duration-200
          mobile:ease-[ease-in-out] mobile:group-data-[compact=true]/home:-mb-18.5
          mobile:group-data-[compact=true]/home:transform-[translateY(-74px)]
          superellipse:rounded-[40px] superellipse:[corner-shape:superellipse(2)] desktop:mx-auto
          desktop:h-[calc(100dvh-90px)] desktop:w-225
          desktop:[background:linear-gradient(var(--color-white)_0%,var(--color-white)_calc(100%-300px),transparent_calc(100%-300px))]
        `}
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
      className={`hidden desktop:absolute desktop:bottom-0 desktop:left-0 desktop:z-3 desktop:flex desktop:w-full desktop:flex-col desktop:items-center desktop:[transition-property:transform] desktop:duration-300 desktop:ease-[ease-in-out] ${atEnd ? 'desktop:transform-[translateY(0)]' : 'desktop:transform-[translateY(100%)]'}`}
      aria-hidden={!atEnd}
      inert={!atEnd}
    >
      {children}
    </footer>
  );
}
