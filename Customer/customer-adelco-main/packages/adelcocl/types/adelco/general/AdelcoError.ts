export interface AdelcoError {
  error: AxiosErrorData;
}

export interface AxiosErrorData {
  message: string;
  statusCode: number;
}
