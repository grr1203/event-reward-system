import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    const errorMessage = 
      typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? String(exceptionResponse['message'])
        : exception.message;

    const errorResponse: ApiResponse = {
      success: false,
      statusCode: status,
      message: errorMessage,
      error: HttpStatus[status] || 'UNKNOWN_ERROR',
    };

    response.status(status).json(errorResponse);
  }
} 