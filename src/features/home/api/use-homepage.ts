'use client';
import useSWR from 'swr';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { getHomepage } from './home-client';
import type { HomepageData, HomepageResult } from '../types';
import { homeEndpoints } from './home-endpoints';

export function useHomepage(initialResult?: HomepageResult) {
  const { handleError } = useErrorHandler();
  return useSWR<HomepageData, Error>(homeEndpoints.homepage, getHomepage, {
    fallbackData: initialResult?.ok ? initialResult.data : undefined,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    onError: handleError,
  });
}
