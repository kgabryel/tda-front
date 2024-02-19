export interface Settings {
  email: string | null;
  emailState: number;
  fbAccount: boolean;
  defaultPagination: string;
  hideDoneTasks: boolean;
  hideRejectedTasks: boolean;
  hideInactiveAlarms: boolean;
  hideDoneSubtasks: boolean;
  hideInactiveNotifications: boolean;
  hideDoneTasksInTasksGroups: boolean;
  hideInactiveAlarmsInAlarmsGroups: boolean;
  autocomplete: boolean;
  notificationLanguage: string;
  pushNotificationKey: string;
}

export interface EmailSettings {
  email: string | null;
  emailState: number;
}
