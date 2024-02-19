import {adapter, key, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {File} from '../../models/file';
import {Catalog} from '../../models/catalog';
import {Search} from '../../services/files-search/files-search.service';
import {StringUtils} from '../../utils/string.utils';
import {PinnedId} from '../../models/pinned';

const selectState = createFeatureSelector<State>(key);

const filesState = createSelector(
  selectState,
  (selectState: State) => selectState.files
);

export const selectFiles = createSelector(
  adapter.getSelectors(filesState).selectAll,
  (files: File[]) => files.sort((a, b) => (a.id < b.id) ? 1 : -1)
);

export const searchFiles = (search: Search) => createSelector(
  selectFiles,
  (files: File[]) => files.filter(file => {
    if (!StringUtils.stringIncludes(file.name, search.name)) {
      return false;
    }
    if (!StringUtils.stringIncludes(file.extension, search.extension)) {
      return false;
    }
    if (search.assignedToDashboard !== null) {
      if (search.assignedToDashboard !== file.assignedToDashboard) {
        return false;
      }
    }
    if (search.catalogs.length > 0) {
      if (!search.catalogs.some(catalog => file.catalogs.includes(catalog))) {
        return false;
      }
    }
    if (search.tasks.length > 0) {
      if (!search.tasks.some(task => file.tasks.includes(task))) {
        return false;
      }
    }
    return true;
  })
);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState) => selectState.loaded
);
export const selectAssignedToDashboard = createSelector(
  selectFiles,
  (files: File[]) => (files.filter((file: File) => file.assignedToDashboard))
);

export const findForCatalog = (catalog: Catalog) => createSelector(
  selectFiles,
  (files: File[]) => (files.filter((file: File) => file.catalogs.includes(catalog.id)))
);

export const selectExpect = (ids: number[]) => createSelector(
  adapter.getSelectors(filesState).selectAll,
  (files: File[]) => files.filter(file => !ids.includes(file.id))
    .sort((a, b) => (a.id < b.id) ? 1 : -1)
);
export const searchPinnedWithSubtasks = (ids: PinnedId[], name: string) => createSelector(
  selectFiles,
  (files: File[]) => files.filter(file => {
    if (!ids.map(pinned => pinned.id).includes(file.id)) {
      return false;
    }
    return StringUtils.stringIncludes(file.name, name);
  }).map((file: File) => {
    return {
      deletable: ids.find(id => id.id === file.id).deletable,
      item: file
    };
  })
);
