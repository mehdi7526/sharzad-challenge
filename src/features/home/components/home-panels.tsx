'use client';

import Image from 'next/image';
import { Wallet2, NotificationBing, User } from '@/shared/components/icons';
import { Button } from '@/shared/components/button';
import { Flex } from '@/shared/components/flex';
import { Modal } from '@/shared/components/modal';
import { Paragraph, Title } from '@/shared/components/typography';
import { useMessage } from '@/shared/components/use-message';
import { useHomeStore } from '../model/home-store';
import { useViewer } from '../api/use-viewer';
import styles from '@/shared/styles/home-panels.module.css';

export default function HomePanels() {
  const { data, error, isLoading, isValidating, mutate } = useViewer();
  const panel = useHomeStore((s) => s.panel);
  const selectedService = useHomeStore((s) => s.selectedService);
  const setPanel = useHomeStore((s) => s.setPanel);
  const message = useMessage();
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
    <>
      <Modal open={panel === 'service'} onCancel={() => setPanel(null)}>
        <Flex className={styles['modal-content']}>
          {selectedService ? (
            <Image
              className={styles['modal-service-icon']}
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
          <Button type="primary" onClick={() => setPanel(null)}>
            متوجه شدم
          </Button>
        </Flex>
      </Modal>

      <Modal open={panel === 'wallet'} onCancel={() => setPanel(null)}>
        <Flex className={styles['modal-content']}>
          <span className={styles['modal-icon']}>
            <Wallet2 size={32} />
          </span>
          <Title level={2}>کیف پول شهرزاد</Title>
          {viewerStatus}
          {data ? (
            <Paragraph>
              {data.signedIn
                ? `موجودی: ${data.wallet.balance.toLocaleString('fa-IR')} تومان`
                : 'برای مشاهدهٔ موجودی و تراکنش‌ها، ورود به حساب کاربری لازم است.'}
            </Paragraph>
          ) : null}
          {data && !data.signedIn ? (
            <Button type="primary" onClick={() => setPanel('profile')}>
              ورود به حساب
            </Button>
          ) : null}
        </Flex>
      </Modal>
      <Modal open={panel === 'notifications'} onCancel={() => setPanel(null)}>
        <Flex className={styles['modal-content']}>
          <span className={styles['modal-icon']}>
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
          <Button onClick={() => setPanel(null)}>بستن</Button>
        </Flex>
      </Modal>
      <Modal open={panel === 'profile'} onCancel={() => setPanel(null)}>
        <Flex className={styles['modal-content']}>
          <span className={styles['modal-icon']}>
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
              setPanel(null);
              message.info('پس از ارائهٔ API احراز هویت فعال می‌شود.');
            }}
          >
            ادامه
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
