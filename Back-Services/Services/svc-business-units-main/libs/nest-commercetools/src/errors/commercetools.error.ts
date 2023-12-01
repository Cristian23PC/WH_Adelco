export class CommercetoolsError extends Error {
  message: string;
  statusCode?: number;
  originalRequest?: any;
  retryCount?: number;
  headers?: any;
  body?: any;
  errors?: Array<object>;

  constructor(partial: Partial<CommercetoolsError> = {}) {
    super(partial.message);
    Object.assign(this, partial);
  }
}
