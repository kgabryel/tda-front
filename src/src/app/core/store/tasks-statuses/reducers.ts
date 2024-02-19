import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {TaskStatus} from '../../models/task-status';
import * as actions from './actions';

export interface State {
  tasksStatuses: EntityState<TaskStatus>,
  loaded: boolean;
}

export const key = 'tasks-statuses';
export const adapter: EntityAdapter<TaskStatus> = createEntityAdapter<TaskStatus>();
const initialState: State = {
  tasksStatuses: adapter.getInitialState(),
  loaded: false
};

export const reducer = createReducer(
  initialState,
  on(actions.taskStatusLoad, (state) => state),
  on(actions.taskStatusLoadError, (state) => state),
  on(actions.taskStatusLoadSuccess, (state, action) => (
    {
      ...state,
      loaded: true,
      tasksStatuses: adapter.addMany(action.statuses, state.tasksStatuses)
    })),
  on(actions.taskStatusReset, () => initialState)
);
