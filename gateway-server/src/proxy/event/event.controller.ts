import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards, Req, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { EventService } from './event.service';
import { ProxyService } from '../proxy.service';
import {
  CreateEventData,
  EventResponseData,
  EventListResponseData,
  CreateRewardData,
  RewardResponseData,
  RewardListResponseData,
  CreateRewardRequestData,
  RewardRequestResponseData,
  RewardRequestListResponseData
} from './dto';

@Controller()
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly proxyService: ProxyService,
  ) { }

  // 이벤트 목록 조회
  @Get('event')
  @HttpCode(HttpStatus.OK)
  async getAllEvents(@Headers() headers, @Req() req): Promise<EventListResponseData> {
    return this.eventService.getEvents(this.proxyService.getForwardHeaders(headers, req.user));
  }

  // 이벤트 상세 조회
  @Get('event/:id')
  @HttpCode(HttpStatus.OK)
  async getEvent(@Param('id') id: string, @Headers() headers, @Req() req): Promise<EventResponseData> {
    return this.eventService.getEventById(id, this.proxyService.getForwardHeaders(headers, req.user));
  }

  // 이벤트 생성
  @Post('event')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async createEvent(@Body() eventData: CreateEventData, @Headers() headers, @Req() req): Promise<EventResponseData> {
    return this.eventService.createEvent(eventData, this.proxyService.getForwardHeaders(headers, req.user));
  }

  // 보상 목록 조회
  @Get('reward')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async getAllRewards(@Headers() headers, @Req() req): Promise<RewardListResponseData> {
    return this.eventService.getRewards(this.proxyService.getForwardHeaders(headers, req.user));
  }

  // 특정 이벤트의 보상 조회
  @Get('reward/event/:eventId')
  @HttpCode(HttpStatus.OK)
  async getRewardsByEventId(@Param('eventId') eventId: string, @Headers() headers, @Req() req): Promise<RewardListResponseData> {
    return this.eventService.getRewardsByEventId(eventId, this.proxyService.getForwardHeaders(headers, req.user));
  }

  // 보상 생성
  @Post('reward')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async createReward(@Body() rewardData: CreateRewardData, @Headers() headers, @Req() req): Promise<RewardResponseData> {
    return this.eventService.createReward(rewardData, this.proxyService.getForwardHeaders(headers, req.user));
  }

  // 보상 요청
  @Post('reward-request')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  async requestReward(@Body() requestData: CreateRewardRequestData, @Headers() headers, @Req() req): Promise<RewardRequestResponseData> {
    return this.eventService.requestReward(requestData, this.proxyService.getForwardHeaders(headers, req.user));
  }

  // 자신의 보상 요청 내역 조회
  @Get('reward-request/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  async getMyRewardRequests(@Headers() headers, @Req() req): Promise<RewardRequestListResponseData> {
    return this.eventService.getMyRewardRequests(this.proxyService.getForwardHeaders(headers, req.user));
  }

  // 전체 보상 요청 내역 조회
  @Get('reward-request')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OPERATOR', 'ADMIN', 'AUDITOR')
  async getAllRewardRequests(
    @Headers() headers,
    @Req() req,
    @Query('conditionType') conditionType?: string,
    @Query('status') status?: string,
  ): Promise<RewardRequestListResponseData> {
    return this.eventService.getAllRewardRequests(
      this.proxyService.getForwardHeaders(headers, req.user),
      conditionType,
      status
    );
  }
} 