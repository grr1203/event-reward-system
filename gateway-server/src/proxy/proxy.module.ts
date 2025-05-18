import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from './proxy.service';
import { AuthController } from './auth/auth.controller';
import { AuthService as ProxyAuthService } from './auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    HttpModule,
    AuthModule
  ],
  controllers: [AuthController],
  providers: [ProxyService, ProxyAuthService],
  exports: [ProxyService, ProxyAuthService],
})
export class ProxyModule {} 