export interface SingleAlarmRequest {
  name: string;
  content: string;
  notifications: NotificationRequest[];
  catalogs: number[];
}

export interface PeriodicAlarmRequest {
  name: string;
  content: string;
  notifications: PeriodicNotificationRequest[];
  catalogs: number[];
  start: string;
  stop: string | null;
  interval: number;
  intervalType: string;
}

export interface PeriodicNotificationRequest {
  notificationTime: number;
  notificationTypes: number[];
  intervalBehaviour: string;
  interval: number | null;
  time: string;
}

export interface NotificationRequest {
  date: string;
  notificationTypes: number[];
}
