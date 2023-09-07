import {createAction, props} from '@ngrx/store';
import {Actions, Prefixes} from '../actions.config';
import {EditVideoRequest, VideoRequest, WatchedRequest} from '../../requests/video.request';
import {Video} from '../../models/video';
import {Update} from '@ngrx/entity';

export const videosLoad = createAction(
  `${Prefixes.videos} ${Actions.load}`
);

export const videosLoadError = createAction(
  `${Prefixes.videos} ${Actions.loadError}`
);

export const videosLoadSuccess = createAction(
  `${Prefixes.videos} ${Actions.loadSuccess}`,
  props<{ videos: Video[] }>()
);

export const videosReload = createAction(
  `${Prefixes.notes} ${Actions.reload}`,
  props<{ selected: number[] }>()
);

export const videosReloadError = createAction(
  `${Prefixes.notes} ${Actions.reloadError}`
);

export const videosReloadSuccess = createAction(
  `${Prefixes.videos} ${Actions.reloadSuccess}`,
  props<{ videos: Video[] }>()
);

export const videoAdd = createAction(
  `${Prefixes.videos} ${Actions.add}`,
  props<{ video: VideoRequest }>()
);

export const videoAddError = createAction(
  `${Prefixes.videos} ${Actions.addError}`
);

export const videoAddSuccess = createAction(
  `${Prefixes.videos} ${Actions.addSuccess}`,
  props<{ videos: Video[] }>()
);

export const videoDelete = createAction(
  `${Prefixes.videos} ${Actions.delete}`,
  props<{ id: number }>()
);

export const videoDeleteError = createAction(
  `${Prefixes.videos} ${Actions.deleteError}`
);

export const videoDeleteSuccess = createAction(
  `${Prefixes.videos} ${Actions.deleteSuccess}`,
  props<{ id: number }>()
);

export const videoUpdate = createAction(
  `${Prefixes.videos} ${Actions.update}`,
  props<{ id: number, request: EditVideoRequest | WatchedRequest }>()
);

export const videoUndoFromDashboard = createAction(
  `${Prefixes.videos} ${Actions.undoFromDashboard}`,
  props<{ id: number }>()
);

export const videoUpdateError = createAction(
  `${Prefixes.videos} ${Actions.updateError}`
);

export const videoUpdateSuccess = createAction(
  `${Prefixes.videos} ${Actions.updateSuccess}`,
  props<{ video: Update<Video> }>()
);

export const videosReset = createAction(
  `${Prefixes.videos} ${Actions.reset}`
);
