import {createAction, props} from '@ngrx/store';
import {Actions, Prefixes} from '../actions.config';
import {Task} from '../../models/task';
import {Update} from '@ngrx/entity';
import {DateRequest, PeriodicTaskRequest, SingleTaskRequest} from '../../requests/tasks.request';

export const tasksLoad = createAction(
  `${Prefixes.tasks} ${Actions.load}`
);

export const taskLoadError = createAction(
  `${Prefixes.tasks} ${Actions.loadError}`
);

export const taskLoadSuccess = createAction(
  `${Prefixes.tasks} ${Actions.loadSuccess}`,
  props<{ tasks: Task[] }>()
);

export const tasksReload = createAction(
  `${Prefixes.tasks} ${Actions.reload}`,
  props<{ selected: string[] }>()
);

export const tasksReloadError = createAction(
  `${Prefixes.tasks} ${Actions.reloadError}`
);

export const tasksReloadSuccess = createAction(
  `${Prefixes.tasks} ${Actions.reloadSuccess}`,
  props<{ tasks: Task[] }>()
);

export const taskDelete = createAction(
  `${Prefixes.tasks} ${Actions.delete}`,
  props<{ id: string, deleteTasks: boolean, deleteAlarm: boolean }>()
);

export const taskDeleteError = createAction(
  `${Prefixes.tasks} ${Actions.deleteError}`
);

export const taskDeleteSuccess = createAction(
  `${Prefixes.tasks} ${Actions.deleteSuccess}`,
  props<{ id: string }>()
);

export const tasksSingleAdd = createAction(
  `${Prefixes.tasks} ${Actions.addSingle}`,
  props<{ task: SingleTaskRequest, redirect: boolean }>()
);

export const tasksPeriodicAdd = createAction(
  `${Prefixes.tasks} ${Actions.addPeriodic}`,
  props<{ task: PeriodicTaskRequest, redirect: boolean }>()
);
export const tasksAddError = createAction(
  `${Prefixes.tasks} ${Actions.addError}`
);

export const tasksAddSuccess = createAction(
  `${Prefixes.tasks} ${Actions.addSuccess}`,
  props<{ task: Task }>()
);

export const taskChangeStatus = createAction(
  `${Prefixes.tasks} ${Actions.changeStatus}`,
  props<{ id: string, status: number }>()
);

export const taskChangeStatusError = createAction(
  `${Prefixes.tasks} ${Actions.changeStatusError}`
);

export const tasksSingleNameUpdate = createAction(
  `${Prefixes.tasks} ${Actions.updateSingleName}`,
  props<{ id: string, name: string | null }>()
);

export const tasksSingleContentUpdate = createAction(
  `${Prefixes.tasks} ${Actions.updateSingleContent}`,
  props<{ id: string, content: string | null }>()
);

export const tasksSingleDateUpdate = createAction(
  `${Prefixes.tasks} ${Actions.updateSingleDate}`,
  props<{ id: string, date: DateRequest }>()
);

export const tasksSingleMainTaskUpdate = createAction(
  `${Prefixes.tasks} ${Actions.updateSingleMainTask}`,
  props<{ id: string, mainTask: string | null }>()
);

export const tasksSingleAlarmUpdate = createAction(
  `${Prefixes.tasks} ${Actions.updateSingleAlarm}`,
  props<{ id: string, alarm: string | null }>()
);

export const tasksPeriodicNameUpdate = createAction(
  `${Prefixes.tasks} ${Actions.updatePeriodicName}`,
  props<{ id: string, name: string | null }>()
);

export const tasksPeriodicContentUpdate = createAction(
  `${Prefixes.tasks} ${Actions.updatePeriodicContent}`,
  props<{ id: string, content: string | null }>()
);

export const catalogRemove = createAction(
  `${Prefixes.tasks} ${Actions.catalogRemove}`,
  props<{ taskId: string, catalogId: number }>()
);

export const noteRemove = createAction(
  `${Prefixes.tasks} ${Actions.noteRemove}`,
  props<{ taskId: string, noteId: number }>()
);

export const bookmarkRemove = createAction(
  `${Prefixes.tasks} ${Actions.bookmarkRemove}`,
  props<{ taskId: string, bookmarkId: number }>()
);

export const fileRemove = createAction(
  `${Prefixes.tasks} ${Actions.fileRemove}`,
  props<{ taskId: string, fileId: number }>()
);

export const videoRemove = createAction(
  `${Prefixes.tasks} ${Actions.videoRemove}`,
  props<{ taskId: string, videoId: number }>()
);

export const catalogAdd = createAction(
  `${Prefixes.tasks} ${Actions.catalogAdd}`,
  props<{ taskId: string, catalogId: number }>()
);

export const noteAdd = createAction(
  `${Prefixes.tasks} ${Actions.noteAdd}`,
  props<{ taskId: string, noteId: number }>()
);

export const bookmarkAdd = createAction(
  `${Prefixes.tasks} ${Actions.bookmarkAdd}`,
  props<{ taskId: string, bookmarkId: number }>()
);

export const fileAdd = createAction(
  `${Prefixes.tasks} ${Actions.fileAdd}`,
  props<{ taskId: string, fileId: number }>()
);

export const videoAdd = createAction(
  `${Prefixes.tasks} ${Actions.videoAdd}`,
  props<{ taskId: string, videoId: number }>()
);

export const tasksUpdateError = createAction(
  `${Prefixes.tasks} ${Actions.updateError}`
);

export const tasksUpdateSuccess = createAction(
  `${Prefixes.tasks} ${Actions.updateSuccess}`,
  props<{ task: Update<Task> }>()
);

export const tasksReset = createAction(
  `${Prefixes.tasks} ${Actions.reset}`
);

export const taskPeriodicActivate = createAction(
  `${Prefixes.tasks} ${Actions.activate}`,
  props<{ id: string, action: string }>()
);

export const taskPeriodicDeactivate = createAction(
  `${Prefixes.tasks} ${Actions.deactivate}`,
  props<{ id: string, action: string }>()
);
