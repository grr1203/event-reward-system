export interface CreateRewardRequestData {
  eventId: string;
  rewardId: string;
}

export interface RewardRequestResponseData {
  id: string;
  userId: string;
  eventId: string;
  rewardId: string;
  status: string;
  reason: string;
  requestedAt: string;
  processedAt: string;
}

export interface RewardRequestListResponseData {
  requests: RewardRequestResponseData[];
} 