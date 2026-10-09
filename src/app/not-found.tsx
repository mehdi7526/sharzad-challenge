import { Title, Link } from '@/shared/components/typography';

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-content-center gap-4 p-8 text-center [&_a]:text-app-action [&_button]:text-app-action">
      <Title level={1}>صفحه پیدا نشد</Title>
      <Link href="/home">بازگشت به صفحهٔ اصلی</Link>
    </main>
  );
}
