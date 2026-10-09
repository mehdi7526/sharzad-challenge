'use client';

import Image from 'next/image';
import { Link } from '@/shared/components/typography';
import type { HomepageResult } from '../types';
import { useHomepage } from '../api/use-homepage';
import { serviceDestination, useOpenService } from '../model/use-open-service';

export function PromoBanner({ initialResult }: { initialResult?: HomepageResult }) {
  const { data } = useHomepage(initialResult);
  const openService = useOpenService();
  const banner = data?.banner;
  const service = data?.services.find((item) => item.id === banner?.serviceId);
  if (!banner || !service) return null;
  const destination = serviceDestination(service);
  return (
    <section className="mb-4 pb-7" aria-label="پیشنهادهای ویژه">
      <Link
        className={`
          block overflow-hidden rounded-[30px] superellipse:[corner-shape:superellipse(2)]
          [&_img]:block [&_img]:h-auto [&_img]:w-full [&_img]:aspect-[2.48] [&_img]:object-cover
        `}
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
