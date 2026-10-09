'use client';

import Image from 'next/image';
import { Link } from '@/shared/components/typography';
import type { HomepageResult } from '../types';
import { useHomepage } from '../api/use-homepage';
import { serviceDestination, useOpenService } from '../model/use-open-service';
import styles from '@/shared/styles/home-services.module.css';

export function PromoBanner({ initialResult }: { initialResult?: HomepageResult }) {
  const { data } = useHomepage(initialResult);
  const openService = useOpenService();
  const banner = data?.banner;
  const service = data?.services.find((item) => item.id === banner?.serviceId);
  if (!banner || !service) return null;
  const destination = serviceDestination(service);
  return (
    <section className={styles['hero-section']} aria-label="پیشنهادهای ویژه">
      <Link
        className={styles['hero-banner']}
        href={destination ?? '#'}
        onClick={(event) => {
          if (destination) return;
          event.preventDefault();
          openService(service);
        }}
      >
        <Image
          width={679}
          height={274}
          sizes="(max-width: 1023px) calc(100vw - 58px), 876px"
          preload
          src={banner.image}
          alt={banner.alt}
        />
      </Link>
    </section>
  );
}
