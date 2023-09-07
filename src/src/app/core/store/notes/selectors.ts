import {adapter, key, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Note} from '../../models/note';
import {Catalog} from '../../models/catalog';
import {Search} from '../../services/notes-search/notes-search.service';
import {StringUtils} from '../../utils/string.utils';
import {EntityState} from '@ngrx/entity';
import {PinnedId} from '../../models/pinned';

const selectState = createFeatureSelector<State>(key);

const notesState = createSelector(
  selectState,
  (selectState: State) => selectState.notes
);

export const selectNotes = createSelector(
  adapter.getSelectors(notesState).selectAll,
  (notes: Note[]) => notes.sort((a, b) => (a.id < b.id) ? 1 : -1)
);

export const searchNotes = (search: Search) => createSelector(
  selectNotes,
  (notes: Note[]) => notes.filter(note => {
    if (!StringUtils.stringIncludes(note.name, search.name)) {
      return false;
    }
    if (!StringUtils.stringIncludes(note.content, search.content)) {
      return false;
    }
    if (search.assignedToDashboard !== null) {
      if (search.assignedToDashboard !== note.assignedToDashboard) {
        return false;
      }
    }
    if (search.catalogs.length > 0) {
      if (!search.catalogs.some(catalog => note.catalogs.includes(catalog))) {
        return false;
      }
    }
    if (search.tasks.length > 0) {
      if (!search.tasks.some(task => note.tasks.includes(task))) {
        return false;
      }
    }
    return true;
  })
);

export const selectAssignedToDashboard = createSelector(
  selectNotes,
  (notes: Note[]) => (notes.filter((note: Note) => note.assignedToDashboard))
);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState) => selectState.loaded
);

export const findForCatalog = (catalog: Catalog) => createSelector(
  selectNotes,
  (notes: Note[]) => (notes.filter((note: Note) => note.catalogs.includes(catalog.id)))
);

export const selectNote = (id: number) => createSelector(
  notesState,
  (notes: EntityState<Note>) => notes.entities[id]
);

export const selectExpect = (ids: number[]) => createSelector(
  adapter.getSelectors(notesState).selectAll,
  (notes: Note[]) => notes.filter(note => !ids.includes(note.id))
    .sort((a, b) => (a.id < b.id) ? 1 : -1)
);
export const searchPinnedWithSubtasks = (ids: PinnedId[], name: string) => createSelector(
  selectNotes,
  (notes: Note[]) => notes.filter(note => {
    if (!ids.map(pinned => pinned.id).includes(note.id)) {
      return false;
    }
    return StringUtils.stringIncludes(note.name, name);
  }).map((note: Note) => {
    return {
      deletable: ids.find(id => id.id === note.id).deletable,
      item: note
    };
  })
);
