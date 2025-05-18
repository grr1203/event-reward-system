import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyService } from './proxy.service';
import { EventController } from './event/event.controller';
import { EventService } from './event/event.service';
import { AuthController } from './auth/auth.controller';
import { AuthService as ProxyAuthService } from './auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    HttpModule,
    AuthModule
  ],
  controllers: [EventController, AuthController],
  providers: [ProxyService, EventService, ProxyAuthService],
  exports: [ProxyService, EventService, ProxyAuthService],
})
export class ProxyModule {} 