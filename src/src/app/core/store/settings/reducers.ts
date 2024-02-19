import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';


export interface State {
  emailState: number;
  email: string | null;
  loaded: boolean;
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

export const key = 'settings';
const initialState: State = {
  emailState: 0,
  email: null,
  loaded: false,
  fbAccount: false,
  defaultPagination: '0',
  hideDoneTasks: false,
  hideRejectedTasks: false,
  hideInactiveAlarms: false,
  hideDoneSubtasks: false,
  hideInactiveNotifications: false,
  hideDoneTasksInTasksGroups: false,
  hideInactiveAlarmsInAlarmsGroups: false,
  autocomplete: false,
  notificationLanguage: '',
  pushNotificationKey: ''
};
export const reducer = createReducer(
  initialState,
  on(actions.settingsLoad, (state) => state),
  on(actions.settingsLoadError, (state) => state),
  on(actions.settingsLoadSuccess, (state, action) => {
    let tmp = {
      ...state,
      loaded: true
    };
    return {
      ...tmp, fbAccount: action.settings.fbAccount,
      emailState: action.settings.emailState,
      email: action.settings.email,
      defaultPagination: action.settings.defaultPagination,
      hideDoneTasks: action.settings.hideDoneTasks,
      hideRejectedTasks: action.settings.hideRejectedTasks,
      hideInactiveAlarms: action.settings.hideInactiveAlarms,
      hideDoneSubtasks: action.settings.hideDoneSubtasks,
      hideInactiveNotifications: action.settings.hideInactiveNotifications,
      hideDoneTasksInTasksGroups: action.settings.hideDoneTasksInTasksGroups,
      hideInactiveAlarmsInAlarmsGroups: action.settings.hideInactiveAlarmsInAlarmsGroups,
      autocomplete: action.settings.autocomplete,
      notificationLanguage: action.settings.notificationLanguage,
      pushNotificationKey: action.settings.pushNotificationKey
    };
  }),
  on(actions.confirmEmail, (state) => state),
  on(actions.confirmEmailError, (state) => state),
  on(actions.confirmEmailSuccess, (state, action) => ({
    ...state,
    emailState: action.settings.emailState,
    email: action.settings.email
  })),
  on(actions.changeSettings, (state) => state),
  on(actions.changeSettingsError, (state) => state),
  on(actions.changeSettingsSuccess, (state, action) => ({
    ...state,
    [action.field]: action.value
  })),
  on(actions.changeEmail, (state) => state),
  on(actions.changeEmailError, (state) => state),
  on(actions.changeEmailSuccess, (state, action) => ({
    ...state,
    emailState: action.settings.emailState,
    email: action.settings.email
  })),
  on(actions.settingsReset, () => initialState)
);
