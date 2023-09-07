import {createAction, props} from '@ngrx/store';
import {Actions, Prefixes} from '../actions.config';
import {TaskStatus} from '../../models/task-status';

export const taskStatusLoad = createAction(
  `${Prefixes.tasksStatuses} ${Actions.load}`
);

export const taskStatusLoadError = createAction(
  `${Prefixes.tasksStatuses} ${Actions.loadError}`
);

export const taskStatusLoadSuccess = createAction(
  `${Prefixes.tasksStatuses} ${Actions.loadSuccess}`,
  props<{ statuses: TaskStatus[] }>()
);

export const taskStatusReset = createAction(
  `${Prefixes.tasksStatuses} ${Actions.reset}`
);
