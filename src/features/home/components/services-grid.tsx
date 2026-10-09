'use client';

import Image from 'next/image';
import { ActionButton } from '@/shared/components/action-button';
import { Button } from '@/shared/components/button';
import { Flex } from '@/shared/components/flex';
import { Link, Paragraph, Text, Title } from '@/shared/components/typography';
import type { HomepageData, Service } from '../types';
import { useHomepage } from '../hooks/use-homepage';
import { serviceDestination, useOpenService } from '../hooks/use-open-service';

const serviceItemClassName = `
  mb-4 flex min-w-0 w-full flex-col items-center justify-start gap-0 text-app-black
  hover:text-app-black focus-visible:text-app-black desktop:mb-12 desktop:h-16
  desktop:flex-row
`;

export function ServicesGrid({
  initialData,
  initialError,
}: {
  initialData?: HomepageData;
  initialError?: string;
}) {
  const { data, error, isValidating, mutate } = useHomepage(initialData);
  const openService = useOpenService();
  const errorMessage = error?.message ?? (!data ? initialError : undefined);
  const services = data?.services ?? [];

  async function retry() {
    await mutate();
  }

  return (
    <section id="services" aria-busy={isValidating}>
      <Flex
        className={`
          mb-4 flex h-5 items-center gap-2 desktop:h-5.5 [&_h1]:m-0
          [&_h1]:text-[14px] [&_h1]:font-bold [&_h1]:leading-5 [&_h1]:whitespace-nowrap
          desktop:[&_h1]:leading-5.5
        `}
      >
        <Title level={1}>خدمات شهرزاد</Title>
        <span className="h-px flex-1 bg-app-divider" />
        {services.length > 0 ? (
          <Link
            className="text-[12px] font-medium whitespace-nowrap text-app-link"
            href="https://web.shahrzadcity.ir/shahrzad-services"
          >
            مشاهده همه
          </Link>
        ) : null}
      </Flex>
      {errorMessage ? (
        <div className="p-4.5 text-center">
          <Paragraph role="alert">{errorMessage}</Paragraph>
          <Button onClick={retry} loading={isValidating} disabled={isValidating}>
            تلاش دوباره
          </Button>
          {isValidating ? <Paragraph role="status">در حال دریافت خدمات…</Paragraph> : null}
        </div>
      ) : null}
      {data && services.length === 0 ? (
        <Paragraph className="p-4.5 text-center" role="status">
          در حال حاضر خدمتی برای نمایش وجود ندارد.
        </Paragraph>
      ) : null}
      <div id="services-grid" className="grid grid-cols-4">
        {services.map((service) => {
          const destination = serviceDestination(service);
          const content = <ServiceContent service={service} />;
          return destination ? (
            <Link className={serviceItemClassName} href={destination} key={service.id}>
              {content}
            </Link>
          ) : (
            <ActionButton
              className={serviceItemClassName}
              key={service.id}
              onClick={() => openService(service)}
              aria-label={service.title}
            >
              {content}
            </ActionButton>
          );
        })}
      </div>
    </section>
  );
}

function ServiceContent({ service }: { service: Service }) {
  return (
    <>
      <span
        className={`
          relative grid h-16 w-16 flex-none place-items-center rounded-2xl bg-app-tile
          squircle:rounded-[50%] squircle:[corner-shape:squircle] [&_img]:block [&_img]:h-10
          [&_img]:w-10 [&_img]:object-contain
        `}
      >
        <Image
          src={service.image}
          alt=""
          width={40}
          height={40}
          sizes="40px"
          unoptimized={!service.image.startsWith('/')}
        />
        {service.badge ? (
          <Text
            className={`
          absolute bottom-0 -left-0.75 h-2 w-5 rounded-sm border border-app-white
          bg-app-badge text-app-white [font:bold_7px/5px_Arial] tracking-[1px] text-center
        `}
            aria-hidden="true"
          >
            •••
          </Text>
        ) : null}
      </span>
      <Text
        className={`
          mt-1.5 block max-w-full text-center text-[10px] font-medium leading-[1.5714285714]
          whitespace-normal desktop:mt-0 desktop:p-2 desktop:text-right desktop:text-[14px]
          desktop:leading-5.5 desktop:wrap-anywhere
        `}
      >
        {service.title}
      </Text>
    </>
  );
}
