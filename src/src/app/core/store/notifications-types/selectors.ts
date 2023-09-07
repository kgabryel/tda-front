import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, key, State} from './reducers';
import {EntityState} from '@ngrx/entity';
import {NotificationType} from '../../models/notification-type';

const selectState = createFeatureSelector<State>(key);

const typesState = createSelector(
  selectState,
  (selectState: State) => selectState.notificationsTypes
);

export const selectTypes = adapter.getSelectors(typesState).selectAll;

export const selectType = (id: number) => createSelector(
  typesState,
  (types: EntityState<NotificationType>) => types.entities[id]
);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState) => selectState.loaded
);
