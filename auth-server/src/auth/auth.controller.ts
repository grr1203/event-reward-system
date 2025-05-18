import { Controller, Post, Patch, Body, HttpCode, HttpStatus, Headers, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, CreateUserDto, UpdateRoleDto, RefreshTokenDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 로그인
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.id, loginDto.password);
  }

  // 액세스 토큰 재발급
  @Post('token/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  // 사용자 등록
  @Post('user')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto, @Headers() headers, @Req() req) {
    return this.authService.createUser(
      createUserDto.id,
      createUserDto.name,
      createUserDto.password,
      createUserDto.role,
    );
  }

  // 사용자 역할 변경
  @Patch('user/role')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(@Body() updateRoleDto: UpdateRoleDto) {
    return this.authService.updateUserRole(
      updateRoleDto.id,
      updateRoleDto.role,
    );
  }
} 