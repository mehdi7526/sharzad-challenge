import { Flex } from '@/shared/components/flex';
import { SkeletonAvatar, SkeletonInput } from '@/shared/components/skeleton';
import { Text, Title } from '@/shared/components/typography';
import styles from '@/shared/styles/home-services.module.css';

export function ServicesLoading() {
  return (
    <section
      className={styles['services-section']}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Flex className={styles['section-heading']}>
        <Title level={1}>خدمات شهرزاد</Title>
        <span className={styles['heading-rule']} />
      </Flex>
      <Text className={styles['visually-hidden']}>در حال بارگذاری خدمات شهرزاد…</Text>
      <div className="grid grid-cols-4" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <Flex className={styles['service-skeleton']} key={index}>
            <SkeletonAvatar active shape="square" size={64} />
            <SkeletonInput active size="small" />
          </Flex>
        ))}
      </div>
    </section>
  );
}
