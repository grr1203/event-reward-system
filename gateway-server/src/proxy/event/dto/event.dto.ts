export interface CreateEventData {
  title: string;
  condition: {
    type: string;
    value: any;
  };
  status: string;
  startAt: string;
  endAt: string;
}

export interface EventResponseData {
  id: string;
  title: string;
  condition: {
    type: string;
    value: any;
  };
  status: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventListResponseData {
  events: EventResponseData[];
} 