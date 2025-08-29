import { Event, EventStatus } from '../types';

export const getEventStatus = (startDate: string, endDate: string): EventStatus => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) {
    return 'upcoming';
  }
  
  if (now >= start && now <= end) {
    return 'live';
  }
  
  // Check if it's a multi-day event that just ended
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 1 && now > end) {
    return 'ongoing';
  }
  
  return 'ended';
};

export const updateEventStatus = (event: Event): Event => ({
  ...event,
  status: getEventStatus(event.startDate, event.endDate),
});

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const isOverdue = (deadline: string): boolean => {
  return new Date(deadline) < new Date();
};