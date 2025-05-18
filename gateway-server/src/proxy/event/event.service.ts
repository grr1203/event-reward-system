import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from '../proxy.service';
import { 
  EventResponseData, 
  EventListResponseData,
  RewardResponseData,
  RewardListResponseData,
  RewardRequestResponseData,
  RewardRequestListResponseData
} from './dto';

@Injectable()
export class EventService {
  private readonly EVENT_SERVER_URL: string;

  constructor(
    private proxyService: ProxyService,
    private configService: ConfigService,
  ) {
    this.EVENT_SERVER_URL = this.configService.get<string>('EVENT_SERVER_URL') || 'http://localhost:3002';
  }

  async getEvents(headers: any): Promise<EventListResponseData> {
    return this.proxyService.forwardRequest(
      'get',
      `${this.EVENT_SERVER_URL}/event`,
      null,
      headers,
    );
  }

  async getEventById(id: string, headers: any): Promise<EventResponseData> {
    return this.proxyService.forwardRequest(
      'get',
      `${this.EVENT_SERVER_URL}/event/${id}`,
      null,
      headers,
    );
  }

  async createEvent(eventData: any, headers: any): Promise<EventResponseData> {
    return this.proxyService.forwardRequest(
      'post',
      `${this.EVENT_SERVER_URL}/event`,
      eventData,
      headers,
    );
  }

  async updateEvent(id: string, eventData: any, headers: any): Promise<EventResponseData> {
    return this.proxyService.forwardRequest(
      'put',
      `${this.EVENT_SERVER_URL}/event/${id}`,
      eventData,
      headers,
    );
  }

  async deleteEvent(id: string, headers: any): Promise<void> {
    return this.proxyService.forwardRequest(
      'delete',
      `${this.EVENT_SERVER_URL}/event/${id}`,
      null,
      headers,
    );
  }

  async getRewards(headers: any): Promise<RewardListResponseData> {
    return this.proxyService.forwardRequest(
      'get',
      `${this.EVENT_SERVER_URL}/reward`,
      null,
      headers,
    );
  }

  async getRewardsByEventId(eventId: string, headers: any): Promise<RewardListResponseData> {
    return this.proxyService.forwardRequest(
      'get',
      `${this.EVENT_SERVER_URL}/reward/event/${eventId}`,
      null,
      headers,
    );
  }

  async createReward(rewardData: any, headers: any): Promise<RewardResponseData> {
    return this.proxyService.forwardRequest(
      'post',
      `${this.EVENT_SERVER_URL}/reward`,
      rewardData,
      headers,
    );
  }

  async requestReward(requestData: any, headers: any): Promise<RewardRequestResponseData> {
    return this.proxyService.forwardRequest(
      'post',
      `${this.EVENT_SERVER_URL}/reward-request`,
      requestData,
      headers,
    );
  }

  async getMyRewardRequests(headers: any): Promise<RewardRequestListResponseData> {
    return this.proxyService.forwardRequest(
      'get',
      `${this.EVENT_SERVER_URL}/reward-request/me`,
      null,
      headers,
    );
  }

  async getAllRewardRequests(headers: any, conditionType?: string, status?: string): Promise<RewardRequestListResponseData> {
    let queryString = conditionType ? `?conditionType=${conditionType}` : '';
    queryString += status ? `&status=${status}` : '';
    return this.proxyService.forwardRequest(
      'get',
      `${this.EVENT_SERVER_URL}/reward-request${queryString}`,
      null,
      headers,
    );
  }
} 