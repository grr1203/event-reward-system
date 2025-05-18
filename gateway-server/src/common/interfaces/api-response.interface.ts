export interface ApiResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;               // 성공시
    error?: string;         // 실패시 
} 