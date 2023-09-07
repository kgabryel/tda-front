import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';
import {Alarm} from '../../models/alarm';


export interface State {
  alarms: EntityState<Alarm>,
  loaded: boolean,
}

export const key = 'alarms';
export const adapter: EntityAdapter<Alarm> = createEntityAdapter<Alarm>();

const initialState: State = {
  alarms: adapter.getInitialState(),
  loaded: false
};
export const reducer = createReducer(
  initialState,
  on(actions.alarmLoad, (state) => state),
  on(actions.alarmLoadError, (state) => state),
  on(actions.alarmLoadSuccess, (state, action) => (
    {
      ...state,
      loaded: true,
      alarms: adapter.addMany(action.alarms, state.alarms)
    })),
  on(actions.alarmsReload, (state) => state),
  on(actions.alarmsReloadError, (state) => state),
  on(actions.alarmsReloadSuccess, (state, action) => ({
    ...state,
    alarms: adapter.removeMany(action.alarms.map(alarm => alarm.id), state.alarms)
  })),
  on(actions.alarmsReloadSuccess, (state, action) => ({
    ...state,
    alarms: adapter.upsertMany(action.alarms, state.alarms)
  })),
  on(actions.alarmsSingleAdd, (state) => state),
  on(actions.alarmsPeriodicAdd, (state) => state),
  on(actions.alarmsAddError, (state) => state),
  on(actions.alarmsAddSuccess, (state, action) => ({
    ...state,
    alarms: adapter.addOne(action.alarm, state.alarms)
  })),
  on(actions.notificationAdd, (state) => state),
  on(actions.notificationGroupAdd, (state) => state),
  on(actions.notificationAddError, (state) => state),
  on(actions.alarmCheck, (state) => state),
  on(actions.alarmCheckError, (state) => state),
  on(actions.alarmUncheck, (state) => state),
  on(actions.alarmUncheckError, (state) => state),
  on(actions.alarmUncheckUnmodified, (state) => state),
  on(actions.alarmUncheckModified, (state, action) => ({
    ...state,
    alarms: adapter.updateOne(action.alarm, state.alarms)
  })),
  on(actions.notificationCheck, (state) => state),
  on(actions.notificationCheckError, (state) => state),
  on(actions.alarmsSingleNameUpdate, (state) => state),
  on(actions.catalogRemove, (state) => state),
  on(actions.catalogAdd, (state) => state),
  on(actions.alarmsUpdateError, (state) => state),
  on(actions.alarmsUpdateSuccess, (state, action) => ({
    ...state,
    alarms: adapter.updateOne(action.alarm, state.alarms)
  })),
  on(actions.alarmsPeriodicNameUpdate, (state) => state),
  on(actions.alarmsSingleContentUpdate, (state) => state),
  on(actions.alarmsPeriodicContentUpdate, (state) => state),
  on(actions.notificationUncheck, (state) => state),
  on(actions.notificationUncheckError, (state) => state),
  on(actions.notificationUncheckUnmodified, (state) => state),
  on(actions.notificationUncheckModified, (state, action) => ({
    ...state,
    alarms: adapter.updateOne(action.alarm, state.alarms)
  })),
  on(actions.alarmSingleDelete, (state) => state),
  on(actions.alarmDeleteError, (state) => state),
  on(actions.alarmPeriodicDelete, (state) => state),
  on(actions.notificationDelete, (state) => state),
  on(actions.notificationDeleteError, (state) => state),
  on(actions.alarmDeleteSuccess, (state, action) => ({
    ...state,
    alarms: adapter.removeMany(action.alarms, state.alarms)
  })),
  on(actions.alarmSingleDisable, (state) => state),
  on(actions.alarmDisableError, (state) => state),
  on(actions.alarmsSingleTaskUpdate, (state) => state),
  on(actions.alarmsReset, () => initialState),
  on(actions.alarmPeriodicActivate, (state) => state),
  on(actions.alarmPeriodicDeactivate, (state) => state)
);
