'use client';
import useSWR from 'swr';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { getViewer } from '../api/home-client';
import type { ViewerData } from '../types';

export function useViewer() {
  const { handleError } = useErrorHandler();
  return useSWR<ViewerData, Error>(
    '/viewer',
    async () => {
      const response = await getViewer();
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      onError: handleError,
    },
  );
}
