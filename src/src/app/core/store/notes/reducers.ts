import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';
import {Note} from '../../models/note';


export interface State {
  notes: EntityState<Note>;
  loaded: boolean;
}

export const key = 'notes';
export const adapter: EntityAdapter<Note> = createEntityAdapter<Note>();
const initialState: State = {
  notes: adapter.getInitialState(),
  loaded: false
};
export const reducer = createReducer(
  initialState,
  on(actions.notesLoad, (state) => state),
  on(actions.notesLoadError, (state) => state),
  on(actions.notesLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    notes: adapter.addMany(action.notes, state.notes)
  })),
  on(actions.notesReload, (state) => state),
  on(actions.notesReloadError, (state) => state),
  on(actions.notesReloadSuccess, (state, action) => ({
    ...state,
    notes: adapter.upsertMany(action.notes, state.notes)
  })),
  on(actions.noteAdd, (state) => state),
  on(actions.noteAddError, (state) => state),
  on(actions.noteAddSuccess, (state, action) => ({
    ...state,
    notes: adapter.addOne(action.note, state.notes)
  })),
  on(actions.noteDelete, (state) => state),
  on(actions.noteDeleteError, (state) => state),
  on(actions.noteDeleteSuccess, (state, action) => ({
    ...state,
    notes: adapter.removeOne(action.id, state.notes)
  })),
  on(actions.noteUpdate, (state) => state),
  on(actions.noteUndoFromDashboard, (state) => state),
  on(actions.noteUpdateError, (state) => state),
  on(actions.noteUpdateSuccess, (state, action) => ({
    ...state,
    notes: adapter.updateOne(action.note, state.notes)
  })),
  on(actions.notesReset, () => initialState)
);
