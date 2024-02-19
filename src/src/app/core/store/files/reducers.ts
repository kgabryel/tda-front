import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {File} from '../../models/file';
import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';


export interface State {
  files: EntityState<File>;
  loaded: boolean;
}

export const key = 'files';
export const adapter: EntityAdapter<File> = createEntityAdapter<File>();
const initialState: State = {
  files: adapter.getInitialState(),
  loaded: false
};
export const reducer = createReducer(
  initialState,
  on(actions.filesLoad, (state) => state),
  on(actions.filesLoadError, (state) => state),
  on(actions.filesLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    files: adapter.addMany(action.files, state.files)
  })),
  on(actions.filesReload, (state) => state),
  on(actions.filesReloadError, (state) => state),
  on(actions.filesReloadSuccess, (state, action) => ({
    ...state,
    files: adapter.upsertMany(action.files, state.files)
  })),
  on(actions.fileAdd, (state) => state),
  on(actions.fileAddError, (state) => state),
  on(actions.fileAddSuccess, (state, action) => ({
    ...state,
    files: adapter.addOne(action.file, state.files)
  })),
  on(actions.fileDelete, (state) => state),
  on(actions.fileDeleteError, (state) => state),
  on(actions.fileDeleteSuccess, (state, action) => ({
    ...state,
    files: adapter.removeOne(action.id, state.files)
  })),
  on(actions.fileUpdate, (state) => state),
  on(actions.fileReplace, (state) => state),
  on(actions.fileUndoFromDashboard, (state) => state),
  on(actions.fileUpdateError, (state) => state),
  on(actions.fileUpdateSuccess, (state, action) => ({
    ...state,
    files: adapter.updateOne(action.file, state.files)
  })),
  on(actions.filesReset, () => initialState)
);
