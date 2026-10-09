'use client';

import Image from 'next/image';
import { useState } from 'react';
import { SkeletonInput } from '@/shared/components/skeleton';
import { Link } from '@/shared/components/typography';
import type { HomepageData } from '../types';
import { useHomepage } from '../hooks/use-homepage';
import { serviceDestination, useOpenService } from '../hooks/use-open-service';

const bannerFrameClassName =
  'relative block aspect-[2.48] overflow-hidden rounded-[30px] superellipse:[corner-shape:superellipse(2)]';

function BannerSkeleton() {
  return (
    <span className="absolute inset-0" aria-hidden="true">
      <SkeletonInput
        active
        className="block h-full w-full [&_.ant-skeleton-input]:block [&_.ant-skeleton-input]:h-full [&_.ant-skeleton-input]:w-full [&_.ant-skeleton-input]:min-w-0 [&_.ant-skeleton-input]:rounded-none"
      />
    </span>
  );
}

function BannerImage({ src, alt }: { src: string; alt: string }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  return (
    <>
      {status === 'loading' ? <BannerSkeleton /> : null}
      {status === 'error' ? (
        <span className="absolute inset-0 grid place-items-center bg-app-tile p-4 text-center text-app-body-muted">
          تصویر پیشنهاد بارگذاری نشد
        </span>
      ) : null}
      <Image
        className={`block h-auto w-full aspect-[2.48] object-cover ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        width={679}
        height={274}
        sizes="(max-width: 1023px) calc(100vw - 58px), 876px"
        preload
        unoptimized={!src.startsWith('/')}
        src={src}
        alt={alt}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </>
  );
}

export function PromoBanner({
  initialData,
  initialError,
}: {
  initialData?: HomepageData;
  initialError?: string;
}) {
  const { data } = useHomepage(initialData);
  const openService = useOpenService();
  const banner = data?.banner;
  const service = data?.services.find((item) => item.id === banner?.serviceId);

  // The route loading shell reserves the same space as the final banner.
  if (!data && !initialData && !initialError) {
    return (
      <section className="mb-4 pb-7" role="status" aria-label="در حال بارگذاری پیشنهادهای ویژه">
        <div className={bannerFrameClassName}>
          <BannerSkeleton />
        </div>
      </section>
    );
  }
  if (!banner || !service) return null;
  const destination = serviceDestination(service);
  return (
    <section className="mb-4 pb-7" aria-label="پیشنهادهای ویژه">
      <Link
        className={bannerFrameClassName}
        href={destination ?? '#'}
        onClick={(event) => {
          if (destination) return;
          event.preventDefault();
          openService(service);
        }}
      >
        <BannerImage key={banner.image} src={banner.image} alt={banner.alt} />
      </Link>
    </section>
  );
}
