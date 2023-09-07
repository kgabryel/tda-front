import {adapter, key, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Color} from '../../models/color';

const selectState = createFeatureSelector<State>(key);

const colorsState = createSelector(
  selectState,
  (selectState: State) => selectState.colors
);

export const selectColors = createSelector(
  adapter.getSelectors(colorsState).selectAll,
  (colors: Color[]) => colors
);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState) => selectState.loaded
);
