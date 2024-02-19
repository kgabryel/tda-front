import {adapter, key, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Video} from '../../models/video';
import {Catalog} from '../../models/catalog';
import {Search} from '../../services/videos-search/videos-search.service';
import {StringUtils} from '../../utils/string.utils';
import {PinnedId} from '../../models/pinned';
import {EntityState} from '@ngrx/entity';

const selectState = createFeatureSelector<State>(key);

const videosState = createSelector(
  selectState,
  (selectState: State) => selectState.videos
);

export const selectVideos = createSelector(
  adapter.getSelectors(videosState).selectAll,
  (videos: Video[]) => videos.sort((a, b) => (a.id < b.id) ? 1 : -1)
);

export const selectVideo = (id: number) => createSelector(
  videosState,
  (videos: EntityState<Video>) => videos.entities[id]
);

export const searchVideos = (search: Search) => createSelector(
  selectVideos,
  (videos: Video[]) => videos.filter(video => {
    if (!StringUtils.stringIncludes(video.name, search.name)) {
      return false;
    }
    if (search.assignedToDashboard !== null) {
      if (search.assignedToDashboard !== video.assignedToDashboard) {
        return false;
      }
    }
    if (search.watched !== null) {
      if (search.watched !== video.watched) {
        return false;
      }
    }
    if (search.catalogs.length > 0) {
      if (!search.catalogs.some(catalog => video.catalogs.includes(catalog))) {
        return false;
      }
    }
    if (search.tasks.length > 0) {
      if (!search.tasks.some(task => video.tasks.includes(task))) {
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
  selectVideos,
  (videos: Video[]) => (videos.filter((video: Video) => video.assignedToDashboard))
);

export const findForCatalog = (catalog: Catalog) => createSelector(
  selectVideos,
  (videos: Video[]) => (videos.filter((video: Video) => video.catalogs.includes(catalog.id)))
);

export const selectExpect = (ids: number[]) => createSelector(
  adapter.getSelectors(videosState).selectAll,
  (videos: Video[]) => videos.filter(video => !ids.includes(video.id))
    .sort((a, b) => (a.id < b.id) ? 1 : -1)
);
export const searchPinnedWithSubtasks = (ids: PinnedId[], name: string) => createSelector(
  selectVideos,
  (videos: Video[]) => videos.filter(video => {
    if (!ids.map(pinned => pinned.id).includes(video.id)) {
      return false;
    }
    return StringUtils.stringIncludes(video.name, name);
  }).map((video: Video) => {
    return {
      deletable: ids.find(id => id.id === video.id).deletable,
      item: video
    };
  })
);
