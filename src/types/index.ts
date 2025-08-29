export type EventType = 'event' | 'hackathon';

export type EventStatus = 'upcoming' | 'live' | 'ongoing' | 'ended';

export interface Event {
  id: string;
  type: EventType;
  name: string;
  startDate: string;
  endDate: string;
  websiteLink: string;
  topics: string[];
  notes?: string;
  status: EventStatus;
  createdAt: string;
}

export interface TodoItem {
  id: string;
  eventId: string;
  title: string;
  completed: boolean;
  deadline?: string;
  createdAt: string;
}

export interface FilterOptions {
  status: EventStatus | 'all';
  type: EventType | 'all';
  sortBy: 'date' | 'name' | 'created';
  sortOrder: 'asc' | 'desc';
}