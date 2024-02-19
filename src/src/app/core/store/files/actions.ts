import {createAction, props} from '@ngrx/store';
import {File} from '../../models/file';
import {Actions, Prefixes} from '../actions.config';
import {EditFileRequest, FileRequest, ReplaceFileRequest} from '../../requests/file.request';
import {Update} from '@ngrx/entity';

export const filesLoad = createAction(
  `${Prefixes.files} ${Actions.load}`
);

export const filesLoadError = createAction(
  `${Prefixes.files} ${Actions.loadError}`
);

export const filesLoadSuccess = createAction(
  `${Prefixes.files} ${Actions.loadSuccess}`,
  props<{ files: File[] }>()
);

export const filesReload = createAction(
  `${Prefixes.files} ${Actions.reload}`,
  props<{ selected: number[] }>()
);

export const filesReloadError = createAction(
  `${Prefixes.files} ${Actions.reloadError}`
);

export const filesReloadSuccess = createAction(
  `${Prefixes.files} ${Actions.reloadSuccess}`,
  props<{ files: File[] }>()
);

export const fileAdd = createAction(
  `${Prefixes.files} ${Actions.add}`,
  props<{ file: FileRequest }>()
);

export const fileAddError = createAction(
  `${Prefixes.files} ${Actions.addError}`
);

export const fileAddSuccess = createAction(
  `${Prefixes.files} ${Actions.addSuccess}`,
  props<{ file: File }>()
);

export const fileDelete = createAction(
  `${Prefixes.files} ${Actions.delete}`,
  props<{ id: number }>()
);

export const fileDeleteError = createAction(
  `${Prefixes.files} ${Actions.deleteError}`
);

export const fileDeleteSuccess = createAction(
  `${Prefixes.files} ${Actions.deleteSuccess}`,
  props<{ id: number }>()
);

export const fileUpdate = createAction(
  `${Prefixes.files} ${Actions.update}`,
  props<{ id: number, file: EditFileRequest }>()
);

export const fileReplace = createAction(
  `${Prefixes.files} ${Actions.replace}`,
  props<{ id: number, file: ReplaceFileRequest }>()
);

export const fileUndoFromDashboard = createAction(
  `${Prefixes.files} ${Actions.undoFromDashboard}`,
  props<{ id: number }>()
);

export const fileUpdateError = createAction(
  `${Prefixes.files} ${Actions.updateError}`
);

export const fileUpdateSuccess = createAction(
  `${Prefixes.files} ${Actions.updateSuccess}`,
  props<{ file: Update<File> }>()
);

export const filesReset = createAction(
  `${Prefixes.files} ${Actions.reset}`
);
