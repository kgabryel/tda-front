export interface Alarm {
  id: string;
  name: string;
  content: string;
  checked: boolean;
  notifications: Notification[];
  periodic: boolean;
  start: string | null;
  stop: string | null;
  interval: number | null;
  intervalType: string | null;
  alarms: Alarm[] | null;
  date: string | null;
  task: string | null;
  group: string | null;
  catalogs: number[];
  active: boolean;
  order: number;
  notificationsGroups: NotificationGroup[];
}

export interface Notification {
  id: number;
  time: string | number,
  checked: boolean;
  types: number[];
}

export interface NotificationGroup {
  id: number;
  hour: string;
  behaviour: string,
  interval: number | null;
  types: number[];
}

export interface AlarmSearch {
  checked: boolean | null,
  start: Date | null,
  stop: Date | null
}
