import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, key, State} from './reducers';

const selectState = createFeatureSelector<State>(key);

const statusesState = createSelector(
  selectState,
  (selectState: State) => selectState.tasksStatuses
);

export const selectStatuses = adapter.getSelectors(statusesState).selectAll;

export const selectIsLoaded = createSelector(
  selectState,
  (selectState) => selectState.loaded
);

