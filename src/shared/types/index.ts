// Object endpoints are not paginated; list endpoints can supply pagination later.
export type ApiResponse<T> = {
  meta: { success: true; pagination?: { current_page: number; total_items: number } };
  data: T;
};

export type ApiErrorResponse = {
  meta: {
    success: false;
    error_code: string;
    error_fields: { field: string; message: string }[];
  };
  message: string;
  error_status: number;
};
