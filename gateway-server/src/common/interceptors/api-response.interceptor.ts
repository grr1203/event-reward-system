import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map(data => ({
        success: true,
        statusCode,
        message: data.message || this.getDefaultMessage(statusCode),
        data,
      })),
    );
  }

  private getDefaultMessage(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.OK:
        return '요청이 성공적으로 처리되었습니다';
      case HttpStatus.CREATED:
        return '리소스가 성공적으로 생성되었습니다';
      default:
        return '요청이 처리되었습니다';
    }
  }
} 