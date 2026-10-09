'use client';
import { ArrowLeft2 } from '@/shared/components/icons';
import { ActionButton } from '@/shared/components/action-button';
import { Text } from '@/shared/components/typography';
import { useHomeStore } from '../model/home-store';
import { useViewer } from '../api/use-viewer';
export function WalletCard({ desktop = false }: { desktop?: boolean }) {
  const setPanel = useHomeStore((state) => state.setPanel);
  const { data } = useViewer();
  const label = data?.wallet.label ?? 'کیف پول';
  return (
    <section
      className={`relative z-2 h-12 flex-none items-center justify-between w-[calc(100%-40px)] mx-auto mb-5 border border-app-white-border rounded-xl bg-app-white-overlay px-3 py-2 text-[12px] text-app-white squircle:rounded-[30px] squircle:[corner-shape:squircle] mobile:transition-[width,transform] mobile:duration-200 mobile:ease-[ease-in-out] mobile:group-data-[compact=true]/home:transform-[translateY(-69.333px)] mobile:group-data-[compact=true]/home:w-[calc(100%-104px)] desktop:w-[166.531px] desktop:m-0 desktop:gap-2 desktop:text-[14px] ${desktop ? 'hidden desktop:flex desktop:mr-auto desktop:ml-6' : 'flex desktop:hidden'}`}
      aria-label="کیف پول"
    >
      <Text className="font-normal">
        {label}
        {desktop ? ':' : ''}
      </Text>
      <ActionButton
        className="flex items-center gap-1 text-[12px] font-bold text-app-white"
        onClick={() => setPanel('wallet')}
      >
        <Text>{desktop ? 'مشاهده' : 'مشاهده موجودی'}</Text>
        <ArrowLeft2 size={20} />
      </ActionButton>
    </section>
  );
}
