import { Flex } from '@/shared/components/flex';
import { SkeletonAvatar, SkeletonInput } from '@/shared/components/skeleton';
import { Text, Title } from '@/shared/components/typography';

export function ServicesLoading() {
  return (
    <section role="status" aria-live="polite" aria-busy="true">
      <Flex
        className={`
          mb-4 flex h-5 items-center gap-2 desktop:h-5.5 [&_h1]:m-0
          [&_h1]:text-[14px] [&_h1]:font-bold [&_h1]:leading-5 [&_h1]:whitespace-nowrap
          desktop:[&_h1]:leading-5.5
        `}
      >
        <Title level={1}>خدمات شهرزاد</Title>
        <span className="h-px flex-1 bg-app-divider" />
      </Flex>
      <Text className="absolute h-px w-px overflow-hidden [clip-path:inset(50%)] whitespace-nowrap">
        در حال بارگذاری خدمات شهرزاد…
      </Text>
      <div className="grid grid-cols-4" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <Flex
            className={`
          mb-4 flex flex-col items-center gap-1.5 desktop:mb-12 desktop:h-16
          desktop:flex-row [&_.ant-skeleton-input]:h-4 [&_.ant-skeleton-input]:w-16
          [&_.ant-skeleton-input]:min-w-16
        `}
            key={index}
          >
            <SkeletonAvatar active shape="square" size={64} />
            <SkeletonInput active size="small" />
          </Flex>
        ))}
      </div>
    </section>
  );
}
