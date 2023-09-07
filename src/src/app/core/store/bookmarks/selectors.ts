import {adapter, key, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Bookmark} from '../../models/bookmark';
import {Catalog} from '../../models/catalog';
import {Search} from '../../services/bookmarks-search/bookmarks-search.service';
import {StringUtils} from '../../utils/string.utils';
import {PinnedId} from '../../models/pinned';
import {EntityState} from '@ngrx/entity';

const selectState = createFeatureSelector<State>(key);

const bookmarksState = createSelector(
  selectState,
  (selectState: State) => selectState.bookmarks
);

export const selectBookmarks = createSelector(
  adapter.getSelectors(bookmarksState).selectAll,
  (bookmarks: Bookmark[]) => bookmarks.sort((a, b) => (a.id < b.id) ? 1 : -1)
);

export const selectBookmark = (id: number) => createSelector(
  bookmarksState,
  (bookmarks: EntityState<Bookmark>) => bookmarks.entities[id]
);

export const searchBookmarks = (search: Search) => createSelector(
  selectBookmarks,
  (bookmarks: Bookmark[]) => bookmarks.filter(bookmark => {
    if (!StringUtils.stringIncludes(bookmark.name, search.name)) {
      return false;
    }
    if (!StringUtils.stringIncludes(bookmark.href, search.href)) {
      return false;
    }
    if (search.assignedToDashboard !== null) {
      if (search.assignedToDashboard !== bookmark.assignedToDashboard) {
        return false;
      }
    }
    if (search.catalogs.length > 0) {
      if (!search.catalogs.some(catalog => bookmark.catalogs.includes(catalog))) {
        return false;
      }
    }
    if (search.tasks.length > 0) {
      if (!search.tasks.some(task => bookmark.tasks.includes(task))) {
        return false;
      }
    }
    return true;
  })
);

export const selectAssignedToDashboard = createSelector(
  selectBookmarks,
  (bookmarks: Bookmark[]) => (bookmarks.filter((bookmark: Bookmark) => bookmark.assignedToDashboard))
);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState) => selectState.loaded
);

export const findForCatalog = (catalog: Catalog) => createSelector(
  selectBookmarks,
  (bookmarks: Bookmark[]) => (bookmarks.filter((bookmark: Bookmark) => bookmark.catalogs.includes(catalog.id)))
);

export const selectExpect = (ids: number[]) => createSelector(
  adapter.getSelectors(bookmarksState).selectAll,
  (bookmarks: Bookmark[]) => bookmarks.filter(bookmark => !ids.includes(bookmark.id))
    .sort((a, b) => (a.id < b.id) ? 1 : -1)
);
export const searchPinnedWithSubtasks = (ids: PinnedId[], name: string) => createSelector(
  selectBookmarks,
  (bookmarks: Bookmark[]) => bookmarks.filter(bookmark => {
    if (!ids.map(pinned => pinned.id).includes(bookmark.id)) {
      return false;
    }
    return StringUtils.stringIncludes(bookmark.name, name);
  }).map((bookmark: Bookmark) => {
    return {
      deletable: ids.find(id => id.id === bookmark.id).deletable,
      item: bookmark
    };
  })
);
