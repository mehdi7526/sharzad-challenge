'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Wallet2, NotificationBing, User } from '@/shared/components/icons';
import { Button } from '@/shared/components/button';
import { Flex } from '@/shared/components/flex';
import { Modal } from '@/shared/components/modal';
import { Paragraph, Title } from '@/shared/components/typography';
import { useMessage } from '@/shared/hooks/use-message';
import { useHomeStore } from '../model/home-store';
import { useViewer } from '../hooks/use-viewer';

const panelContentClassName = `
  flex flex-col items-center pt-3.5 px-2.5 pb-1 text-center [&_h2]:mt-2.5
  [&_h2]:mb-1.75 [&_h2]:mx-0 [&_h2]:text-[18px] [&_div.ant-typography]:max-w-87.5
  [&_div.ant-typography]:m-0 [&_div.ant-typography]:mb-4.5
  [&_div.ant-typography]:text-app-body-muted [&_div.ant-typography]:text-[13px]
  [&_div.ant-typography]:leading-[1.9]
`;

export default function HomePanels() {
  const { data, error, isLoading, isValidating, mutate } = useViewer();
  const panel = useHomeStore((s) => s.panel);
  const selectedService = useHomeStore((s) => s.selectedService);
  const setPanel = useHomeStore((s) => s.setPanel);
  const message = useMessage();
  const [open, setOpen] = useState(true);
  const contentRef = useRef<HTMLElement>(null);
  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true });
  }, [panel]);
  const closePanel = () => setOpen(false);
  const title =
    panel === 'service'
      ? selectedService?.title
      : panel
        ? {
            wallet: 'کیف پول شهرزاد',
            notifications: 'اعلان‌ها',
            profile: 'حساب کاربری',
          }[panel]
        : undefined;
  async function retryViewer() {
    await mutate();
  }
  const viewerStatus = error ? (
    <>
      <Paragraph role="alert">{error.message}</Paragraph>
      <Button onClick={retryViewer} loading={isValidating}>
        تلاش دوباره
      </Button>
    </>
  ) : isLoading ? (
    <Paragraph role="status">در حال دریافت اطلاعات حساب…</Paragraph>
  ) : null;
  return (
    <Modal
      open={open}
      onCancel={closePanel}
      afterClose={() => setPanel(null)}
      title={title}
      styles={{ header: { display: 'none' } }}
    >
      <Flex ref={contentRef} tabIndex={-1} className={`${panelContentClassName} outline-none`}>
        {panel === 'service' ? (
          <>
            {selectedService ? (
              <Image
                className="h-18.5 w-18.5 rounded-[20px] bg-app-modal-tile object-contain"
                src={selectedService.image}
                alt=""
                width={74}
                height={74}
                unoptimized={!selectedService.image.startsWith('/')}
              />
            ) : null}
            <Title level={2}>{selectedService?.title}</Title>
            <Paragraph>
              این خدمت در نسخهٔ نمایشی در دسترس نیست و برای استفاده به سرویس شهرزاد نیاز دارد.
            </Paragraph>
            <Button type="primary" onClick={closePanel}>
              متوجه شدم
            </Button>
          </>
        ) : null}

        {panel === 'wallet' ? (
          <>
            <span className="grid h-15 w-15 place-items-center rounded-[19px] bg-app-modal-icon text-app-action">
              <Wallet2 size={32} />
            </span>
            <Title level={2}>کیف پول شهرزاد</Title>
            {viewerStatus}
            {data ? (
              <Paragraph>
                {data.signedIn && data.wallet.balance !== null
                  ? `موجودی: ${data.wallet.balance.toLocaleString('fa-IR')} تومان`
                  : 'برای مشاهدهٔ موجودی و تراکنش‌ها، ورود به حساب کاربری لازم است.'}
              </Paragraph>
            ) : null}
            {data && !data.signedIn ? (
              <Button type="primary" onClick={() => setPanel('profile')}>
                ورود به حساب
              </Button>
            ) : null}
          </>
        ) : null}
        {panel === 'notifications' ? (
          <>
            <span className="grid h-15 w-15 place-items-center rounded-[19px] bg-app-modal-icon text-app-action">
              <NotificationBing size={30} />
            </span>
            <Title level={2}>اعلان‌ها</Title>
            {viewerStatus}
            {data ? (
              <Paragraph>
                {data.notifications.unreadCount
                  ? `${data.notifications.unreadCount} اعلان خوانده‌نشده دارید.`
                  : 'در حال حاضر اعلان جدیدی ندارید.'}
              </Paragraph>
            ) : null}
            <Button onClick={closePanel}>بستن</Button>
          </>
        ) : null}
        {panel === 'profile' ? (
          <>
            <span className="grid h-15 w-15 place-items-center rounded-[19px] bg-app-modal-icon text-app-action">
              <User size={30} />
            </span>
            <Title level={2}>حساب کاربری</Title>
            {viewerStatus}
            {data ? (
              <Paragraph>
                {data.signedIn
                  ? 'وضعیت حساب در این نسخه نمایشی است.'
                  : 'برای ادامه، شمارهٔ همراه خود را وارد کنید. ورود در نسخهٔ نمایشی غیرفعال است.'}
              </Paragraph>
            ) : null}
            <Button
              disabled={!data || Boolean(error)}
              type="primary"
              onClick={() => {
                closePanel();
                message.info('پس از ارائهٔ API احراز هویت فعال می‌شود.');
              }}
            >
              ادامه
            </Button>
          </>
        ) : null}
      </Flex>
    </Modal>
  );
}
