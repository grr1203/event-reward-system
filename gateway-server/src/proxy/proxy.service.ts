import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  // 사용자 정보를 포함한 헤더 생성
  getForwardHeaders(headers: any, user: any): any {
    const forwardHeaders = { ...headers };
    if (user) {
      forwardHeaders['X-User-Id'] = user.id;
      forwardHeaders['X-User-Role'] = user.role;
    }
    return forwardHeaders;
  }

  // 특정 서비스로 요청 전달
  async forwardRequest(
    method: string,
    url: string,
    data?: any,
    headers?: any,
  ): Promise<any> {
    try {
      const config: AxiosRequestConfig = { headers };
      let response: AxiosResponse<any>;

      switch (method.toLowerCase()) {
        case 'get':
          response = await lastValueFrom(
            this.httpService.get(url, config),
          );
          break;
        case 'post':
          response = await lastValueFrom(
            this.httpService.post(url, data, config),
          );
          break;
        case 'put':
          response = await lastValueFrom(
            this.httpService.put(url, data, config),
          );
          break;
        case 'patch':
          response = await lastValueFrom(
            this.httpService.patch(url, data, config),
          );
          break;
        case 'delete':
          response = await lastValueFrom(
            this.httpService.delete(url, config),
          );
          break;
        default:
          throw new HttpException(`지원하지 않는 HTTP 메서드: ${method}`, 400);
      }

      return response.data;
    } catch (error) {
      // 원격 서비스 오류들
      if (error.response) {
        throw new HttpException(
          error.response.data,
          error.response.status || 500,
        );
      }
      // 다른 오류들
      throw new HttpException(
        `원격 서비스 호출 실패: ${error.message}`,
        500,
      );
    }
  }
} 