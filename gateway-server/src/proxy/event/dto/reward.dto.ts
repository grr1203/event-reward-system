export interface CreateRewardData {
  eventId: string;
  type: string;
  amount: number;
  itemId?: string;
  currency?: string;
  couponCode?: string;
  description: string;
}

export interface RewardResponseData {
  id: string;
  eventId: string;
  type: string;
  amount: number;
  itemId?: string;
  currency?: string;
  couponCode?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RewardListResponseData {
  rewards: RewardResponseData[];
} 