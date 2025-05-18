import { Controller, Post, Patch, Get, Body, Param, Headers, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ProxyService } from '../proxy.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  LoginResponseData,
  TokenResponseData,
  UserResponseData,
  RoleResponseData,
} from './dto';
import { Role } from 'src/common/interfaces/role.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly proxyService: ProxyService,
  ) { }

  // 로그인
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { id: string, password: string }): Promise<LoginResponseData> {
    return this.authService.login(body);
  }

  // 액세스 토큰 재발급
  @Post('token/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: { refreshToken: string }): Promise<TokenResponseData> {
    return this.authService.refreshToken(body.refreshToken);
  }

  // 사용자 등록
  @Post('user')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createUser(@Body() body: { id: string, name: string, password: string, role: Role }, @Headers() headers, @Req() req): Promise<UserResponseData> {
    return this.authService.createUser(body, this.proxyService.getForwardHeaders(headers, req.user));
  }

  // 사용자 역할 변경
  @Patch('user/role')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateUserRole(@Body() body: { id: string, role: Role }, @Headers() headers, @Req() req): Promise<RoleResponseData> {
    return this.authService.updateUserRole(body, this.proxyService.getForwardHeaders(headers, req.user));
  }
} 