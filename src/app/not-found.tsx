import { Title, Link } from '@/shared/components/typography';

export default function NotFound() {
  return (
    <main className="route-state">
      <Title level={1}>صفحه پیدا نشد</Title>
      <Link href="/home">بازگشت به صفحهٔ اصلی</Link>
    </main>
  );
}
