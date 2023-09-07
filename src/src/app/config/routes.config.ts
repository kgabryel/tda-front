import {environment} from '../../environments/environment';

export const bookmarksRoutes = {
  index: environment.baseUrl + 'api/bookmarks',
  getIcon: environment.baseUrl + 'api/bookmarks/get-icon',
  byId: (id: number) => environment.baseUrl + `api/bookmarks/${id}`
};
export const alarmsRoutes = {
  index: environment.baseUrl + 'api/alarms',
  checkAlarm: (id: string) => environment.baseUrl + `api/alarms/${id}/check`,
  uncheckAlarm: (id: string) => environment.baseUrl + `api/alarms/${id}/uncheck`,
  checkNotification: (id: number) => environment.baseUrl + `api/alarms/notifications/${id}/check`,
  uncheckNotification: (id: number) => environment.baseUrl + `api/alarms/notifications/${id}/uncheck`,
  byId: (id: string) => environment.baseUrl + `api/alarms/${id}`,
  singleAlarm: (id: string) => environment.baseUrl + `api/alarms/${id}/single`,
  periodicAlarm: (id: string) => environment.baseUrl + `api/alarms/${id}/periodic`,
  notificationById: (id: number) => environment.baseUrl + `api/alarms/notifications/${id}`,
  createSingle: environment.baseUrl + 'api/alarms/create/single',
  createPeriodic: environment.baseUrl + 'api/alarms/create/periodic',
  notificationsTypes: environment.baseUrl + 'api/alarms/notifications/types',
  disableSingleAlarm: environment.baseUrl + 'api/alarms/deactivate',
  addNotification: (id: string, type: string) => environment.baseUrl + `api/alarms/${id}/${type}/notifications`,
  undoCatalog: (alarmId: string,
    catalogId: number) => environment.baseUrl + `api/alarms/${alarmId}/catalogs/${catalogId}`,
  addCatalog: (alarmId: string) => environment.baseUrl + `api/alarms/${alarmId}/catalogs`,
  deactivatePeriodic: (id: string) => environment.baseUrl + `api/alarms/${id}/deactivate`,
  activatePeriodic: (id: string) => environment.baseUrl + `api/alarms/${id}/activate`
};
export const tasksRoutes = {
  index: environment.baseUrl + 'api/tasks',
  statuses: environment.baseUrl + 'api/tasks/statuses',
  createSingle: environment.baseUrl + 'api/tasks/create/single',
  createPeriodic: environment.baseUrl + 'api/tasks/create/periodic',
  changeStatus: (id: string) => environment.baseUrl + `api/tasks/${id}/change-status`,
  byId: (id: string) => environment.baseUrl + `api/tasks/${id}`,
  singleTask: (id: string) => environment.baseUrl + `api/tasks/${id}/single`,
  periodicTask: (id: string) => environment.baseUrl + `api/tasks/${id}/periodic`,
  undo: (taskId: string, itemId: number, type: string) => environment.baseUrl + `api/tasks/${taskId}/${type}/${itemId}`,
  addPinned: (taskId: string, type: string) => environment.baseUrl + `api/tasks/${taskId}/${type}`,
  deactivatePeriodic: (id: string) => environment.baseUrl + `api/tasks/${id}/deactivate`,
  activatePeriodic: (id: string) => environment.baseUrl + `api/tasks/${id}/activate`
};

export const notesRoutes = {
  index: environment.baseUrl + 'api/notes',
  byId: (id: number) => environment.baseUrl + `api/notes/${id}`
};

export const authRoutes = {
  login: environment.baseUrl + 'api/login',
  register: environment.baseUrl + 'api/register',
  refreshToken: environment.baseUrl + 'api/refresh-token',
  fbRedirect: environment.baseUrl + 'api/facebook/redirect',
  fbLogin: environment.baseUrl + 'api/facebook/login',
  changePassword: environment.baseUrl + 'api/settings/change-password',
  sendResetPassword: environment.baseUrl + 'api/send-reset-password',
  resetPassword: environment.baseUrl + 'api/reset-password'
};

export const filesRoutes = {
  index: environment.baseUrl + 'api/files',
  byId: (id: number) => environment.baseUrl + `api/files/${id}`,
  download: (id: number) => environment.baseUrl + `api/files/${id}/download`
};

export const videosRoutes = {
  index: environment.baseUrl + 'api/videos',
  byId: (id: number) => environment.baseUrl + `api/videos/${id}`
};
export const colorsRoutes = {
  index: environment.baseUrl + 'api/colors',
  byId: (id: number) => environment.baseUrl + `api/colors/${id}`
};

export const dashboardRoutes = {
  undoNote: (id: number) => environment.baseUrl + `api/dashboard/notes/${id}`,
  undoBookmark: (id: number) => environment.baseUrl + `api/dashboard/bookmarks/${id}`,
  undoFile: (id: number) => environment.baseUrl + `api/dashboard/files/${id}`,
  undoVideo: (id: number) => environment.baseUrl + `api/dashboard/videos/${id}`,
  undoCatalog: (id: number) => environment.baseUrl + `api/dashboard/catalogs/${id}`
};

export const catalogsRoutes = {
  index: environment.baseUrl + 'api/catalogs',
  byId: (id: number) => environment.baseUrl + `api/catalogs/${id}`,
  undo: (catalogId: number,
    itemId: number | string,
    type: string) => environment.baseUrl + `api/catalogs/${catalogId}/${type}/${itemId}`
};

export const settingsRoutes = {
  index: environment.baseUrl + 'api/settings',
  changeEmail: environment.baseUrl + `api/settings/change-email`,
  confirmEmail: environment.baseUrl + `api/settings/confirm-email`,
  sendCode: environment.baseUrl + `api/settings/send-code`,
  changeSettings: (field: string) => environment.baseUrl + `api/settings/${field}`,
  subscription: environment.baseUrl + 'api/settings/subscription'
};
