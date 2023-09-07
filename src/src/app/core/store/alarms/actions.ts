import {createAction, props} from '@ngrx/store';
import {Alarm} from '../../models/alarm';
import {
  NotificationRequest,
  PeriodicAlarmRequest,
  PeriodicNotificationRequest,
  SingleAlarmRequest
} from '../../requests/alarms.request';
import {Update} from '@ngrx/entity';
import {Actions, Prefixes} from '../actions.config';

export const alarmLoad = createAction(
  `${Prefixes.alarms} ${Actions.load}`
);

export const alarmLoadError = createAction(
  `${Prefixes.alarms} ${Actions.loadError}`
);

export const alarmLoadSuccess = createAction(
  `${Prefixes.alarms} ${Actions.loadSuccess}`,
  props<{ alarms: Alarm[] }>()
);

export const alarmsReload = createAction(
  `${Prefixes.alarms} ${Actions.reload}`,
  props<{ selected: string[] }>()
);

export const alarmsReloadError = createAction(
  `${Prefixes.alarms} ${Actions.reloadError}`
);

export const alarmsReloadSuccess = createAction(
  `${Prefixes.alarms} ${Actions.reloadSuccess}`,
  props<{ alarms: Alarm[] }>()
);

export const alarmCheck = createAction(
  `${Prefixes.alarms} ${Actions.check}`,
  props<{ id: string }>()
);

export const alarmCheckError = createAction(
  `${Prefixes.alarms} ${Actions.checkError}`
);


export const alarmUncheck = createAction(
  `${Prefixes.alarms} ${Actions.uncheck}`,
  props<{ id: string }>()
);

export const alarmUncheckError = createAction(
  `${Prefixes.alarms} ${Actions.uncheckError}`
);

export const alarmUncheckModified = createAction(
  `${Prefixes.alarms} ${Actions.uncheckModified}`,
  props<{ alarm: Update<Alarm> }>()
);

export const alarmUncheckUnmodified = createAction(
  `${Prefixes.alarms} ${Actions.uncheckUnmodified}`
);

export const alarmsSingleAdd = createAction(
  `${Prefixes.alarms} ${Actions.addSingle}`,
  props<{ alarm: SingleAlarmRequest, redirect: boolean }>()
);

export const alarmsPeriodicAdd = createAction(
  `${Prefixes.alarms} ${Actions.addPeriodic}`,
  props<{ alarm: PeriodicAlarmRequest, redirect: boolean }>()
);

export const alarmsAddError = createAction(
  `${Prefixes.alarms} ${Actions.addError}`
);

export const alarmsAddSuccess = createAction(
  `${Prefixes.alarms} ${Actions.addSuccess}`,
  props<{ alarm: Alarm }>()
);

export const alarmsSingleNameUpdate = createAction(
  `${Prefixes.alarms} ${Actions.updateSingleName}`,
  props<{ id: string, name: string }>()
);

export const alarmsPeriodicNameUpdate = createAction(
  `${Prefixes.alarms} ${Actions.updatePeriodicName}`,
  props<{ id: string, name: string }>()
);

export const alarmsSingleContentUpdate = createAction(
  `${Prefixes.alarms} ${Actions.updateSingleContent}`,
  props<{ id: string, content: string | null }>()
);

export const alarmsPeriodicContentUpdate = createAction(
  `${Prefixes.alarms} ${Actions.updatePeriodicContent}`,
  props<{ id: string, content: string | null }>()
);

export const alarmsSingleTaskUpdate = createAction(
  `${Prefixes.alarms} ${Actions.updateSingleTask}`,
  props<{ id: string, task: string | null }>()
);

export const catalogRemove = createAction(
  `${Prefixes.alarms} ${Actions.catalogRemove}`,
  props<{ alarmId: string, catalogId: number }>()
);

export const catalogAdd = createAction(
  `${Prefixes.alarms} ${Actions.catalogAdd}`,
  props<{ alarmId: string, catalogId: number }>()
);

export const alarmsUpdateError = createAction(
  `${Prefixes.alarms} ${Actions.updateError}`
);

export const alarmsUpdateSuccess = createAction(
  `${Prefixes.alarms} ${Actions.updateSuccess}`,
  props<{ alarm: Update<Alarm> }>()
);

export const alarmSingleDelete = createAction(
  `${Prefixes.alarms} ${Actions.deleteSingle}`,
  props<{ id: string }>()
);

export const alarmPeriodicDelete = createAction(
  `${Prefixes.alarms} ${Actions.deletePeriodic}`,
  props<{ id: string, delete: boolean }>()
);

export const alarmDeleteError = createAction(
  `${Prefixes.alarms} ${Actions.deleteError}`
);

export const alarmDeleteSuccess = createAction(
  `${Prefixes.alarms} ${Actions.deleteSuccess}`,
  props<{ alarms: string[] }>()
);

export const alarmSingleDisable = createAction(
  `${Prefixes.alarms} ${Actions.disableSingle}`,
  props<{ code: string }>()
);

export const alarmDisableError = createAction(
  `${Prefixes.alarms} ${Actions.disableError}`
);

export const notificationCheck = createAction(
  `${Prefixes.notifications} ${Actions.check}`,
  props<{ id: number }>()
);

export const notificationCheckError = createAction(
  `${Prefixes.notifications} ${Actions.checkError}`
);

export const notificationUncheck = createAction(
  `${Prefixes.notifications} ${Actions.uncheck}`,
  props<{ id: number }>()
);

export const notificationUncheckError = createAction(
  `${Prefixes.notifications} ${Actions.uncheckError}`
);

export const notificationUncheckModified = createAction(
  `${Prefixes.notifications} ${Actions.uncheckModified}`,
  props<{ alarm: Update<Alarm> }>()
);

export const notificationUncheckUnmodified = createAction(
  `${Prefixes.notifications} ${Actions.uncheckUnmodified}`
);

export const notificationAdd = createAction(
  `${Prefixes.notifications} ${Actions.add}`,
  props<{ alarmId: string, notification: NotificationRequest }>()
);

export const notificationGroupAdd = createAction(
  `${Prefixes.notifications} ${Actions.addGroup}`,
  props<{ alarmId: string, notification: PeriodicNotificationRequest }>()
);

export const notificationAddError = createAction(
  `${Prefixes.notifications} ${Actions.addError}`
);

export const notificationDelete = createAction(
  `${Prefixes.notifications} ${Actions.delete}`,
  props<{ alarm: Alarm, id: number }>()
);

export const notificationDeleteError = createAction(
  `${Prefixes.notifications} ${Actions.deleteError}`
);

export const alarmsReset = createAction(
  `${Prefixes.alarms} ${Actions.reset}`
);

export const alarmPeriodicActivate = createAction(
  `${Prefixes.alarms} ${Actions.activate}`,
  props<{ id: string, action: string }>()
);

export const alarmPeriodicDeactivate = createAction(
  `${Prefixes.alarms} ${Actions.deactivate}`,
  props<{ id: string, action: string }>()
);
