import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';
import {Bookmark} from '../../models/bookmark';

export interface State {
  bookmarks: EntityState<Bookmark>;
  loaded: boolean;
}

export const key = 'bookmarks';
export const adapter: EntityAdapter<Bookmark> = createEntityAdapter<Bookmark>();
const initialState: State = {
  bookmarks: adapter.getInitialState(),
  loaded: false
};
export const reducer = createReducer(
  initialState,
  on(actions.bookmarksLoad, (state) => state),
  on(actions.bookmarksLoadError, (state) => state),
  on(actions.bookmarksLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    bookmarks: adapter.addMany(action.bookmarks, state.bookmarks)
  })),
  on(actions.bookmarksReload, (state) => state),
  on(actions.bookmarksReloadError, (state) => state),
  on(actions.bookmarksReloadSuccess, (state, action) => ({
    ...state,
    bookmarks: adapter.upsertMany(action.bookmarks, state.bookmarks)
  })),
  on(actions.bookmarkAdd, (state) => state),
  on(actions.bookmarkAddError, (state) => state),
  on(actions.bookmarkAddSuccess, (state, action) => ({
    ...state,
    bookmarks: adapter.addOne(action.bookmark, state.bookmarks)
  })),
  on(actions.bookmarkDelete, (state) => state),
  on(actions.bookmarkDeleteError, (state) => state),
  on(actions.bookmarkDeleteSuccess, (state, action) => ({
    ...state,
    bookmarks: adapter.removeOne(action.id, state.bookmarks)
  })),
  on(actions.bookmarkUpdate, (state) => state),
  on(actions.bookmarkUndoFromDashboard, (state) => state),
  on(actions.bookmarkUpdateError, (state) => state),
  on(actions.bookmarkUpdateSuccess, (state, action) => ({
    ...state,
    bookmarks: adapter.updateOne(action.bookmark, state.bookmarks)
  })),
  on(actions.bookmarksReset, () => initialState)
);
