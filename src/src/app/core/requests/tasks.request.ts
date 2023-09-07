import {NotificationRequest, PeriodicNotificationRequest} from './alarms.request';

export interface SingleTaskRequest {
  task: SingleTask;
  alarm: SingleAlarm | null;
}

interface SingleTask {
  name: string;
  content: string;
  date: string | null;
  mainTask: string | null;
  bookmarks: number[];
  files: number[];
  notes: number[];
  catalogs: number[];
  videos: number[];
}

interface SingleAlarm {
  name: string;
  content: string;
  notifications: NotificationRequest[];
  catalogs: number[];
}

export interface PeriodicTaskRequest {
  task: PeriodicTask;
  alarm: PeriodicAlarm | null;
}

interface PeriodicTask {
  name: string;
  content: string;
  start: string;
  stop: string | null;
  interval: number;
  intervalType: number;
  bookmarks: number[];
  files: number[];
  notes: number[];
  catalogs: number[];
  videos: number[];
}

interface PeriodicAlarm {
  name: string;
  content: string | null;
  notifications: PeriodicNotificationRequest[];
  catalogs: number[];
}

export interface DateRequest {
  date: string | null;
}
