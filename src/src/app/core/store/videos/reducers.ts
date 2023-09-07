import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';
import {Video} from '../../models/video';


export interface State {
  videos: EntityState<Video>;
  loaded: boolean;
}

export const key = 'videos';
export const adapter: EntityAdapter<Video> = createEntityAdapter<Video>();
const initialState: State = {
  videos: adapter.getInitialState(),
  loaded: false
};
export const reducer = createReducer(
  initialState,
  on(actions.videosLoad, (state) => state),
  on(actions.videosLoadError, (state) => state),
  on(actions.videosLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    videos: adapter.addMany(action.videos, state.videos)
  })),
  on(actions.videosReload, (state) => state),
  on(actions.videosReloadError, (state) => state),
  on(actions.videosReloadSuccess, (state, action) => ({
    ...state,
    videos: adapter.upsertMany(action.videos, state.videos)
  })),
  on(actions.videoAdd, (state) => state),
  on(actions.videoAddError, (state) => state),
  on(actions.videoAddSuccess, (state, action) => ({
    ...state,
    videos: adapter.addMany(action.videos, state.videos)
  })),
  on(actions.videoDelete, (state) => state),
  on(actions.videoDeleteError, (state) => state),
  on(actions.videoDeleteSuccess, (state, action) => ({
    ...state,
    videos: adapter.removeOne(action.id, state.videos)
  })),
  on(actions.videoUpdate, (state) => state),
  on(actions.videoUndoFromDashboard, (state) => state),
  on(actions.videoUpdateError, (state) => state),
  on(actions.videoUpdateSuccess, (state, action) => ({
    ...state,
    videos: adapter.updateOne(action.video, state.videos)
  })),
  on(actions.videosReset, () => initialState)
);
