export class ApiError extends Error {
  id: string;
  code: string;
  status: number;
  title: string;
  detail: string;
  meta: string;
  data: string;

  constructor(partial: Partial<ApiError> = {}) {
    super(partial.title);
    Object.assign(this, partial);
  }
}
