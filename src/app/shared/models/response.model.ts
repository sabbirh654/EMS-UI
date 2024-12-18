export interface ApiResponse<T> {
  isSuccess: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  errors: string[];
  result: T | null;
}
