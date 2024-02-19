import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {NotificationType} from '../../models/notification-type';
import * as actions from './actions';

export interface State {
  notificationsTypes: EntityState<NotificationType>,
  loaded: boolean;
}

export const key = 'notifications-types';
export const adapter: EntityAdapter<NotificationType> = createEntityAdapter<NotificationType>();
const initialState: State = {
  notificationsTypes: adapter.getInitialState(),
  loaded: false
};

export const reducer = createReducer(
  initialState,
  on(actions.notificationTypesLoad, (state) => state),
  on(actions.notificationTypesLoadError, (state) => state),
  on(actions.notificationTypesLoadSuccess, (state, action) => (
    {
      ...state,
      loaded: true,
      notificationsTypes: adapter.addMany(action.notificationTypes, state.notificationsTypes)
    })),
  on(actions.notificationTypesReset, () => initialState)
);
