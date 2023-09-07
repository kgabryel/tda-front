import {createAction, props} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {Note} from '../../models/note';
import {NoteRequest} from '../../requests/note.request';
import {Actions, Prefixes} from '../actions.config';

export const notesLoad = createAction(
  `${Prefixes.notes} ${Actions.load}`
);

export const notesLoadError = createAction(
  `${Prefixes.notes} ${Actions.loadError}`
);

export const notesLoadSuccess = createAction(
  `${Prefixes.notes} ${Actions.loadSuccess}`,
  props<{ notes: Note[] }>()
);

export const notesReload = createAction(
  `${Prefixes.notes} ${Actions.reload}`,
  props<{ selected: number[] }>()
);

export const notesReloadError = createAction(
  `${Prefixes.notes} ${Actions.reloadError}`
);

export const notesReloadSuccess = createAction(
  `${Prefixes.notes} ${Actions.reloadSuccess}`,
  props<{ notes: Note[] }>()
);

export const noteAdd = createAction(
  `${Prefixes.notes} ${Actions.add}`,
  props<{ note: NoteRequest }>()
);

export const noteAddError = createAction(
  `${Prefixes.notes} ${Actions.addError}`
);

export const noteAddSuccess = createAction(
  `${Prefixes.notes} ${Actions.addSuccess}`,
  props<{ note: Note }>()
);

export const noteDelete = createAction(
  `${Prefixes.notes} ${Actions.delete}`,
  props<{ id: number }>()
);

export const noteDeleteError = createAction(
  `${Prefixes.notes} ${Actions.deleteError}`
);

export const noteDeleteSuccess = createAction(
  `${Prefixes.notes} ${Actions.deleteSuccess}`,
  props<{ id: number }>()
);

export const noteUpdate = createAction(
  `${Prefixes.notes} ${Actions.update}`,
  props<{ id: number, note: NoteRequest }>()
);

export const noteUndoFromDashboard = createAction(
  `${Prefixes.notes} ${Actions.undoFromDashboard}`,
  props<{ id: number }>()
);

export const noteUpdateError = createAction(
  `${Prefixes.notes} ${Actions.updateError}`
);

export const noteUpdateSuccess = createAction(
  `${Prefixes.notes} ${Actions.updateSuccess}`,
  props<{ note: Update<Note> }>()
);

export const notesReset = createAction(
  `${Prefixes.notes} ${Actions.reset}`
);
