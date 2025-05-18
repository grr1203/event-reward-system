import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from '../proxy.service';
import { Role } from 'src/common/interfaces/role.type';
import { LoginResponseData, RoleResponseData, TokenResponseData, UserResponseData } from './dto';

@Injectable()
export class AuthService {
  private readonly AUTH_SERVER_URL: string;

  constructor(
    private proxyService: ProxyService,
    private configService: ConfigService,
  ) {
    this.AUTH_SERVER_URL = this.configService.get<string>('AUTH_SERVER_URL') || 'http://localhost:3001';
  }

  async login(data: { id: string, password: string }): Promise<LoginResponseData> {
    return this.proxyService.forwardRequest(
      'post',
      `${this.AUTH_SERVER_URL}/auth/login`,
      data,
    );
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseData> {
    return this.proxyService.forwardRequest(
      'post',
      `${this.AUTH_SERVER_URL}/auth/token/refresh`,
      { refreshToken },
    );
  }

  async createUser(data: { id: string, name: string, password: string, role: Role }, headers: any): Promise<UserResponseData> {
    return this.proxyService.forwardRequest(
      'post',
      `${this.AUTH_SERVER_URL}/auth/user`,
      data,
      headers,
    );
  }

  async updateUserRole(data: { id: string, role: Role }, headers: any): Promise<RoleResponseData> {
    return this.proxyService.forwardRequest(
      'patch',
      `${this.AUTH_SERVER_URL}/auth/user/role`,
      data,
      headers,
    );
  }
} 