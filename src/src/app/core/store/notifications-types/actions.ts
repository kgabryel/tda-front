import {createAction, props} from '@ngrx/store';
import {NotificationType} from '../../models/notification-type';
import {Actions, Prefixes} from '../actions.config';

export const notificationTypesLoad = createAction(
  `${Prefixes.notificationTypes} ${Actions.load}`
);

export const notificationTypesLoadError = createAction(
  `${Prefixes.notificationTypes} ${Actions.loadError}`
);

export const notificationTypesLoadSuccess = createAction(
  `${Prefixes.notificationTypes} ${Actions.loadSuccess}`,
  props<{ notificationTypes: NotificationType[] }>()
);

export const notificationTypesReset = createAction(
  `${Prefixes.notificationTypes} ${Actions.reset}`
);
