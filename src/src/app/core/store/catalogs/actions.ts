import {createAction, props} from '@ngrx/store';
import {Actions, Prefixes} from '../actions.config';
import {CatalogRequest} from '../../requests/catalog.request';
import {Update} from '@ngrx/entity';
import {Catalog} from '../../models/catalog';

export const catalogsLoad = createAction(
  `${Prefixes.catalogs} ${Actions.load}`
);

export const catalogsLoadError = createAction(
  `${Prefixes.catalogs} ${Actions.loadError}`
);

export const catalogsLoadSuccess = createAction(
  `${Prefixes.catalogs} ${Actions.loadSuccess}`,
  props<{ catalogs: Catalog[] }>()
);

export const catalogsReload = createAction(
  `${Prefixes.catalogs} ${Actions.reload}`,
  props<{ selected: number[] }>()
);

export const catalogsReloadError = createAction(
  `${Prefixes.catalogs} ${Actions.reloadError}`
);

export const catalogsReloadSuccess = createAction(
  `${Prefixes.catalogs} ${Actions.reloadSuccess}`,
  props<{ catalogs: Catalog[] }>()
);

export const catalogAdd = createAction(
  `${Prefixes.catalogs} ${Actions.add}`,
  props<{ catalog: CatalogRequest }>()
);

export const catalogAddError = createAction(
  `${Prefixes.catalogs} ${Actions.addError}`
);

export const catalogAddSuccess = createAction(
  `${Prefixes.catalogs} ${Actions.addSuccess}`,
  props<{ catalog: Catalog }>()
);

export const catalogDelete = createAction(
  `${Prefixes.catalogs} ${Actions.delete}`,
  props<{ id: number }>()
);

export const catalogDeleteError = createAction(
  `${Prefixes.catalogs} ${Actions.deleteError}`
);

export const catalogDeleteSuccess = createAction(
  `${Prefixes.catalogs} ${Actions.deleteSuccess}`,
  props<{ id: number }>()
);

export const catalogUpdate = createAction(
  `${Prefixes.catalogs} ${Actions.update}`,
  props<{ id: number, catalog: CatalogRequest }>()
);

export const alarmRemove = createAction(
  `${Prefixes.catalogs} ${Actions.alarmRemove}`,
  props<{ catalogId: number, alarmId: string }>()
);

export const taskRemove = createAction(
  `${Prefixes.catalogs} ${Actions.taskRemove}`,
  props<{ catalogId: number, taskId: string }>()
);

export const noteRemove = createAction(
  `${Prefixes.catalogs} ${Actions.noteRemove}`,
  props<{ catalogId: number, noteId: number }>()
);

export const bookmarkRemove = createAction(
  `${Prefixes.catalogs} ${Actions.bookmarkRemove}`,
  props<{ catalogId: number, bookmarkId: number }>()
);

export const fileRemove = createAction(
  `${Prefixes.catalogs} ${Actions.fileRemove}`,
  props<{ catalogId: number, fileId: number }>()
);

export const videoRemove = createAction(
  `${Prefixes.catalogs} ${Actions.videoRemove}`,
  props<{ catalogId: number, videoId: number }>()
);

export const catalogUndoFromDashboard = createAction(
  `${Prefixes.catalogs} ${Actions.undoFromDashboard}`,
  props<{ id: number }>()
);

export const catalogUpdateError = createAction(
  `${Prefixes.catalogs} ${Actions.updateError}`
);

export const catalogUpdateSuccess = createAction(
  `${Prefixes.catalogs} ${Actions.updateSuccess}`,
  props<{ catalog: Update<Catalog> }>()
);

export const catalogsReset = createAction(
  `${Prefixes.catalogs} ${Actions.reset}`
);
