import {adapter, key, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Catalog} from '../../models/catalog';
import {StringUtils} from '../../utils/string.utils';
import {EntityState} from '@ngrx/entity';
import {Search} from '../../services/catalogs-search/catalogs-search.service';
import {PinnedId} from '../../models/pinned';

const selectState = createFeatureSelector<State>(key);

const catalogsState = createSelector(
  selectState,
  (selectState: State) => selectState.catalogs
);

export const selectCatalogs = createSelector(
  adapter.getSelectors(catalogsState).selectAll,
  (catalogs: Catalog[]) => catalogs.sort((a, b) => (a.id < b.id) ? 1 : -1)
);

export const searchCatalogs = (search: Search) => createSelector(
  selectCatalogs,
  (catalogs: Catalog[]) => catalogs.filter(catalog => {
    if (!StringUtils.stringIncludes(catalog.name, search.name)) {
      return false;
    }
    if (search.assignedToDashboard !== null) {
      if (search.assignedToDashboard !== catalog.assignedToDashboard) {
        return false;
      }
    }
    if (search.alarms.length > 0) {
      if (!search.alarms.some(alarm => catalog.alarms.includes(alarm))) {
        return false;
      }
    }
    if (search.tasks.length > 0) {
      if (!search.tasks.some(task => catalog.tasks.includes(task))) {
        return false;
      }
    }
    if (search.notes.length > 0) {
      if (!search.notes.some(note => catalog.notes.includes(note))) {
        return false;
      }
    }
    if (search.bookmarks.length > 0) {
      if (!search.bookmarks.some(bookmark => catalog.bookmarks.includes(bookmark))) {
        return false;
      }
    }
    if (search.files.length > 0) {
      if (!search.files.some(file => catalog.files.includes(file))) {
        return false;
      }
    }
    if (search.videos.length > 0) {
      if (!search.videos.some(video => catalog.videos.includes(video))) {
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

export const searchPinned = (ids: number[], name: string) => createSelector(
  selectCatalogs,
  (catalogs: Catalog[]) => catalogs.filter(catalog => {
    if (!ids.includes(catalog.id)) {
      return false;
    }
    return StringUtils.stringIncludes(catalog.name, name);
  })
);

export const selectExpect = (ids: number[]) => createSelector(
  adapter.getSelectors(catalogsState).selectAll,
  (catalogs: Catalog[]) => catalogs.filter(catalog => !ids.includes(catalog.id))
    .sort((a, b) => (a.id < b.id) ? 1 : -1)
);
export const searchPinnedWithSubtasks = (ids: PinnedId[], name: string) => createSelector(
  selectCatalogs,
  (catalogs: Catalog[]) => catalogs.filter(catalog => {
    if (!ids.map(pinned => pinned.id).includes(catalog.id)) {
      return false;
    }
    return StringUtils.stringIncludes(catalog.name, name);
  }).map((catalog: Catalog) => {
    return {
      deletable: ids.find(id => id.id === catalog.id).deletable,
      item: catalog
    };
  })
);

export const selectAssignedToDashboard = createSelector(
  selectCatalogs,
  (catalogs: Catalog[]) => (catalogs.filter((catalog: Catalog) => catalog.assignedToDashboard))
);

export const selectCatalog = (id: number) => createSelector(
  catalogsState,
  (catalogs: EntityState<Catalog>) => catalogs.entities[id]
);
