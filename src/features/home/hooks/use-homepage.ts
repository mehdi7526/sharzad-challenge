'use client';
import useSWR from 'swr';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { getHomepage } from '../api/home-api';
import type { HomepageData } from '../types';

export function useHomepage(initialData?: HomepageData) {
  const { handleError } = useErrorHandler();
  return useSWR<HomepageData, Error>(
    '/home',
    async () => {
      const response = await getHomepage();
      return response.data;
    },
    {
      fallbackData: initialData,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      onError: handleError,
    },
  );
}
