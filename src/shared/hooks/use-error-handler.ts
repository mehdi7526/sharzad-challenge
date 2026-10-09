'use client';

import { useCallback } from 'react';
import { useMessage } from '@/shared/components/use-message';
import { normalizeApiError } from '@/shared/lib/api-error';

export function useErrorHandler() {
  const message = useMessage();
  const handleError = useCallback(
    (error: unknown) => {
      void message.error(normalizeApiError(error).message);
    },
    [message],
  );
  return { handleError };
}
