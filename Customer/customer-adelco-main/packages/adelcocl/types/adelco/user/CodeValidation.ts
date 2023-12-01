export interface CodeValidationPayload {
  username: string;
  code: string;
}

export interface CodeValidationResponse {
  statusCode: number;
  message: string;
  code?: string;
  data?: {
    remainingAttempts: number;
  };
}
