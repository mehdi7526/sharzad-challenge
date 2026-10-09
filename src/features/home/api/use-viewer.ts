'use client';
import useSWR from 'swr';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { getViewer } from './home-client';
import { homeEndpoints } from './home-endpoints';
import type { ViewerData } from '../types';

export function useViewer() {
  const { handleError } = useErrorHandler();
  return useSWR<ViewerData, Error>(homeEndpoints.viewer, getViewer, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    onError: handleError,
  });
}
