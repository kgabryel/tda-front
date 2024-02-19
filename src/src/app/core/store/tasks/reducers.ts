import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Task} from '../../models/task';
import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';

export interface State {
  tasks: EntityState<Task>;
  loaded: boolean;
}

export const key = 'tasks';
export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>();
const initialState: State = {
  tasks: adapter.getInitialState(),
  loaded: false
};
export const reducer = createReducer(
  initialState,
  on(actions.tasksSingleAdd, (state) => state),
  on(actions.tasksAddError, (state) => state),
  on(actions.tasksPeriodicAdd, (state) => state),
  on(actions.tasksAddError, (state) => state),
  on(actions.tasksAddSuccess, (state, action) => ({
    ...state,
    tasks: adapter.addOne(action.task, state.tasks)
  })),
  on(actions.taskLoadError, (state) => state),
  on(actions.taskLoadSuccess, (state, action) => (
    {
      ...state,
      loaded: true,
      tasks: adapter.addMany(action.tasks, state.tasks)
    })),
  on(actions.tasksReload, (state) => state),
  on(actions.tasksReloadError, (state) => state),
  on(actions.tasksReloadSuccess, (state, action) => ({
    ...state,
    tasks: adapter.removeMany(action.tasks.map(task => task.id), state.tasks)
  })),
  on(actions.tasksReloadSuccess, (state, action) => ({
    ...state,
    tasks: adapter.upsertMany(action.tasks, state.tasks)
  })),
  on(actions.taskChangeStatus, (state) => state),
  on(actions.taskChangeStatusError, (state) => state),
  on(actions.taskDelete, (state) => state),
  on(actions.taskDeleteError, (state) => state),
  on(actions.taskDeleteSuccess, (state, action) => ({
    ...state,
    tasks: adapter.removeOne(action.id, state.tasks)
  })),
  on(actions.tasksSingleNameUpdate, (state) => state),
  on(actions.catalogRemove, (state) => state),
  on(actions.noteRemove, (state) => state),
  on(actions.bookmarkRemove, (state) => state),
  on(actions.fileRemove, (state) => state),
  on(actions.videoRemove, (state) => state),
  on(actions.catalogAdd, (state) => state),
  on(actions.noteAdd, (state) => state),
  on(actions.bookmarkAdd, (state) => state),
  on(actions.fileAdd, (state) => state),
  on(actions.videoAdd, (state) => state),
  on(actions.tasksUpdateError, (state) => state),
  on(actions.tasksUpdateSuccess, (state, action) => ({
    ...state,
    tasks: adapter.updateOne(action.task, state.tasks)
  })),
  on(actions.tasksPeriodicNameUpdate, (state) => state),
  on(actions.tasksSingleMainTaskUpdate, (state) => state),
  on(actions.tasksSingleAlarmUpdate, (state) => state),
  on(actions.tasksSingleContentUpdate, (state) => state),
  on(actions.tasksPeriodicContentUpdate, (state) => state),
  on(actions.tasksSingleDateUpdate, (state) => state),
  on(actions.tasksReset, () => initialState),
  on(actions.taskPeriodicActivate, (state) => state),
  on(actions.taskPeriodicDeactivate, (state) => state)
);
