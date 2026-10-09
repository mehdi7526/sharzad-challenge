'use client';
import { Button } from '@/shared/components/button';
export function BackToTop({ targetId }: { targetId?: string }) {
  return (
    <Button
      className="mr-auto ml-0 flex h-10 rounded-xl border border-app-link bg-app-white px-4 py-2 text-[14px] font-medium text-app-link"
      onClick={() =>
        (targetId ? document.getElementById(targetId) : window)?.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    >
      بازگشت به بالا
    </Button>
  );
}
