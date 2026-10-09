import { describe, expect, it } from 'vitest';
import {
  ApiContractError,
  apiErrorResponse,
  parseApiErrorResponse,
  parseApiResponse,
} from '@/shared/lib/api-response';

const viewer = {
  signedIn: false,
  wallet: { label: 'کیف پول', balance: null },
  notifications: { unreadCount: 0 },
};

describe('API envelope', () => {
  it('extracts data from a successful response envelope', () => {
    expect(parseApiResponse({ meta: { success: true }, data: viewer })).toEqual(viewer);
  });

  it.each([viewer, { meta: { success: false }, data: viewer }, { meta: { success: true } }])(
    'rejects missing or unsuccessful envelopes %#',
    (response) => {
      expect(() => parseApiResponse(response)).toThrow(ApiContractError);
    },
  );

  it('accepts valid optional pagination and rejects invalid pagination', () => {
    const response = {
      meta: { success: true, pagination: { current_page: 1, total_items: 0 } },
      data: viewer,
    };
    expect(parseApiResponse(response)).toEqual(viewer);
    expect(() =>
      parseApiResponse({
        ...response,
        meta: { success: true, pagination: { current_page: 0, total_items: -1 } },
      }),
    ).toThrow(ApiContractError);
  });

  it('preserves error status, code and field messages', () => {
    const response = {
      ...apiErrorResponse('اطلاعات معتبر نیست', 422, 'VALIDATION_ERROR'),
      meta: {
        success: false,
        error_code: 'VALIDATION_ERROR',
        error_fields: [{ field: 'mobile', message: 'شماره نامعتبر است' }],
      },
    };
    expect(parseApiErrorResponse(response)).toEqual(response);
  });

  it('rejects malformed error fields and non-error status codes', () => {
    const response = apiErrorResponse('خطای سرویس', 503);
    expect(
      parseApiErrorResponse({
        ...response,
        meta: { ...response.meta, error_fields: [{ field: 42, message: 'خطا' }] },
      }),
    ).toBeUndefined();
    expect(parseApiErrorResponse({ ...response, error_status: 200 })).toBeUndefined();
  });
});
