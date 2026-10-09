'use client';

import Image from 'next/image';
import { ActionButton } from '@/shared/components/action-button';
import { Button } from '@/shared/components/button';
import { Flex } from '@/shared/components/flex';
import { Link, Paragraph, Text, Title } from '@/shared/components/typography';
import type { HomepageResult, Service } from '../types';
import { useHomepage } from '../api/use-homepage';
import { serviceDestination, useOpenService } from '../model/use-open-service';
import styles from '@/shared/styles/home-services.module.css';

export function ServicesGrid({ initialResult }: { initialResult: HomepageResult }) {
  const { data, error, isValidating, mutate } = useHomepage(initialResult);
  const openService = useOpenService();
  const errorMessage =
    error?.message ?? (!data && !initialResult.ok ? initialResult.message : null);
  const services = data?.services ?? [];

  async function retry() {
    await mutate();
  }

  return (
    <section className={styles['services-section']} id="services" aria-busy={isValidating}>
      <Flex className={styles['section-heading']}>
        <Title level={1}>خدمات شهرزاد</Title>
        <span className={styles['heading-rule']} />
        {services.length > 0 ? (
          <Link className={styles['see-all']} href="https://web.shahrzadcity.ir/shahrzad-services">
            مشاهده همه
          </Link>
        ) : null}
      </Flex>
      {errorMessage ? (
        <div className={styles['error-state']}>
          <Paragraph role="alert">{errorMessage}</Paragraph>
          <Button onClick={retry} loading={isValidating} disabled={isValidating}>
            تلاش دوباره
          </Button>
          {isValidating ? <Paragraph role="status">در حال دریافت خدمات…</Paragraph> : null}
        </div>
      ) : null}
      {data && services.length === 0 ? (
        <Paragraph className={styles['error-state']} role="status">
          در حال حاضر خدمتی برای نمایش وجود ندارد.
        </Paragraph>
      ) : null}
      <div id="services-grid" className="grid grid-cols-4">
        {services.map((service) => {
          const destination = serviceDestination(service);
          const content = <ServiceContent service={service} />;
          return destination ? (
            <Link className={styles['service-item']} href={destination} key={service.id}>
              {content}
            </Link>
          ) : (
            <ActionButton
              className={styles['service-item']}
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
      <span className={styles['service-icon-wrap']}>
        <Image
          src={service.image}
          alt=""
          width={40}
          height={40}
          sizes="40px"
          unoptimized={!service.image.startsWith('/')}
        />
        {service.badge ? (
          <Text className={styles['service-badge']} aria-hidden="true">
            •••
          </Text>
        ) : null}
      </span>
      <Text className={styles['service-title']}>{service.title}</Text>
    </>
  );
}
