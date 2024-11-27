export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    result: T | null;
}