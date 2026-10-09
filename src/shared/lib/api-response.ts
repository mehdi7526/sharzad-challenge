import type { ApiErrorResponse } from '@/shared/types';

export class ApiContractError extends Error {}

export function parseApiResponse(value: unknown): unknown {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('meta' in value) ||
    typeof value.meta !== 'object' ||
    value.meta === null ||
    !('success' in value.meta) ||
    value.meta.success !== true ||
    !('data' in value)
  )
    throw new ApiContractError('Invalid API response envelope');
  if ('pagination' in value.meta) {
    const pagination = value.meta.pagination;
    if (
      typeof pagination !== 'object' ||
      pagination === null ||
      !('current_page' in pagination) ||
      typeof pagination.current_page !== 'number' ||
      !Number.isInteger(pagination.current_page) ||
      pagination.current_page < 1 ||
      !('total_items' in pagination) ||
      typeof pagination.total_items !== 'number' ||
      !Number.isInteger(pagination.total_items) ||
      pagination.total_items < 0
    )
      throw new ApiContractError('Invalid pagination');
  }
  return value.data;
}

export function parseApiErrorResponse(value: unknown): ApiErrorResponse | undefined {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('message' in value) ||
    typeof value.message !== 'string' ||
    !value.message.trim() ||
    !('error_status' in value) ||
    typeof value.error_status !== 'number' ||
    !Number.isInteger(value.error_status) ||
    value.error_status < 400 ||
    value.error_status > 599 ||
    !('meta' in value) ||
    typeof value.meta !== 'object' ||
    value.meta === null ||
    !('success' in value.meta) ||
    value.meta.success !== false ||
    !('error_code' in value.meta) ||
    typeof value.meta.error_code !== 'string' ||
    !('error_fields' in value.meta) ||
    !Array.isArray(value.meta.error_fields)
  )
    return undefined;
  const fields: ApiErrorResponse['meta']['error_fields'] = [];
  for (const field of value.meta.error_fields) {
    if (
      typeof field !== 'object' ||
      field === null ||
      !('field' in field) ||
      typeof field.field !== 'string' ||
      !('message' in field) ||
      typeof field.message !== 'string'
    )
      return undefined;
    fields.push({ field: field.field, message: field.message });
  }
  return {
    meta: { success: false, error_code: value.meta.error_code, error_fields: fields },
    message: value.message,
    error_status: value.error_status,
  };
}

export function apiErrorResponse(
  message: string,
  status: number,
  code = 'REQUEST_FAILED',
): ApiErrorResponse {
  return {
    meta: { success: false, error_code: code, error_fields: [] },
    message,
    error_status: status,
  };
}
