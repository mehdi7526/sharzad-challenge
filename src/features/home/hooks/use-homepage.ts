'use client';
import useSWR from 'swr';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { getHomepage } from '../api/home-client';
import type { HomepageData, HomepageResult } from '../types';

export function useHomepage(initialResult?: HomepageResult) {
  const { handleError } = useErrorHandler();
  return useSWR<HomepageData, Error>(
    '/home',
    async () => {
      const response = await getHomepage();
      return response.data;
    },
    {
      fallbackData: initialResult?.ok ? initialResult.data : undefined,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      onError: handleError,
    },
  );
}
