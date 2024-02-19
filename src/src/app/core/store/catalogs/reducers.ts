import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';
import {Catalog} from '../../models/catalog';


export interface State {
  catalogs: EntityState<Catalog>;
  loaded: boolean;
}

export const key = 'catalogs';
export const adapter: EntityAdapter<Catalog> = createEntityAdapter<Catalog>();
const initialState: State = {
  catalogs: adapter.getInitialState(),
  loaded: false
};
export const reducer = createReducer(
  initialState,
  on(actions.catalogsLoad, (state) => state),
  on(actions.catalogsLoadError, (state) => state),
  on(actions.catalogsLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    catalogs: adapter.addMany(action.catalogs, state.catalogs)
  })),
  on(actions.catalogsReload, (state) => state),
  on(actions.catalogsReloadError, (state) => state),
  on(actions.catalogsReloadSuccess, (state, action) => ({
    ...state,
    catalogs: adapter.upsertMany(action.catalogs, state.catalogs)
  })),
  on(actions.catalogAdd, (state) => state),
  on(actions.catalogAddError, (state) => state),
  on(actions.catalogAddSuccess, (state, action) => ({
    ...state,
    catalogs: adapter.addOne(action.catalog, state.catalogs)
  })),
  on(actions.catalogDelete, (state) => state),
  on(actions.catalogDeleteError, (state) => state),
  on(actions.catalogDeleteSuccess, (state, action) => ({
    ...state,
    catalogs: adapter.removeOne(action.id, state.catalogs)
  })),
  on(actions.catalogUpdate, (state) => state),
  on(actions.catalogUndoFromDashboard, (state) => state),
  on(actions.alarmRemove, (state) => state),
  on(actions.taskRemove, (state) => state),
  on(actions.noteRemove, (state) => state),
  on(actions.bookmarkRemove, (state) => state),
  on(actions.fileRemove, (state) => state),
  on(actions.videoRemove, (state) => state),
  on(actions.catalogUpdateError, (state) => state),
  on(actions.catalogUpdateSuccess, (state, action) => ({
    ...state,
    catalogs: adapter.updateOne(action.catalog, state.catalogs)
  })),
  on(actions.catalogsReset, () => initialState)
);
