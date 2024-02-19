import {createAction, props} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {Bookmark} from '../../models/bookmark';
import {BookmarkRequest} from '../../requests/bookmark.request';
import {Actions, Prefixes} from '../actions.config';

export const bookmarksLoad = createAction(
  `${Prefixes.bookmarks} ${Actions.load}`
);

export const bookmarksLoadSuccess = createAction(
  `${Prefixes.bookmarks} ${Actions.loadSuccess}`,
  props<{ bookmarks: Bookmark[] }>()
);

export const bookmarksLoadError = createAction(
  `${Prefixes.bookmarks} ${Actions.loadError}`
);

export const bookmarksReload = createAction(
  `${Prefixes.bookmarks} ${Actions.reload}`,
  props<{ selected: number[] }>()
);

export const bookmarksReloadError = createAction(
  `${Prefixes.bookmarks} ${Actions.reloadError}`
);

export const bookmarksReloadSuccess = createAction(
  `${Prefixes.bookmarks} ${Actions.reloadSuccess}`,
  props<{ bookmarks: Bookmark[] }>()
);

export const bookmarkAdd = createAction(
  `${Prefixes.bookmarks} ${Actions.add}`,
  props<{ bookmark: BookmarkRequest }>()
);

export const bookmarkAddError = createAction(
  `${Prefixes.bookmarks} ${Actions.addError}`
);

export const bookmarkAddSuccess = createAction(
  `${Prefixes.bookmarks} ${Actions.addSuccess}`,
  props<{ bookmark: Bookmark }>()
);

export const bookmarkDelete = createAction(
  `${Prefixes.bookmarks} ${Actions.delete}`,
  props<{ id: number }>()
);

export const bookmarkDeleteError = createAction(
  `${Prefixes.bookmarks} ${Actions.deleteError}`
);

export const bookmarkDeleteSuccess = createAction(
  `${Prefixes.bookmarks} ${Actions.deleteSuccess}`,
  props<{ id: number }>()
);

export const bookmarkUpdate = createAction(
  `${Prefixes.bookmarks} ${Actions.update}`,
  props<{ id: number, bookmark: BookmarkRequest }>()
);

export const bookmarkUndoFromDashboard = createAction(
  `${Prefixes.bookmarks} ${Actions.undoFromDashboard}`,
  props<{ id: number }>()
);

export const bookmarkUpdateError = createAction(
  `${Prefixes.bookmarks} ${Actions.updateError}`
);

export const bookmarkUpdateSuccess = createAction(
  `${Prefixes.bookmarks} ${Actions.updateSuccess}`,
  props<{ bookmark: Update<Bookmark> }>()
);

export const bookmarksReset = createAction(
  `${Prefixes.bookmarks} ${Actions.reset}`
);
