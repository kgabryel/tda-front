import {key, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';


const selectState = createFeatureSelector<State>(key);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState) => selectState.loaded
);

export const selectEmailState = createSelector(
  selectState,
  (selectState: State) => selectState.emailState
);

export const selectEmail = createSelector(
  selectState,
  (selectState: State) => selectState.email
);

export const selectIsFbAccount = createSelector(
  selectState,
  (selectState: State) => selectState.fbAccount
);

export const selectDefaultPagination = createSelector(
  selectState,
  (selectState: State) => selectState.defaultPagination
);

export const selectSettings = (field: string) => createSelector(
  selectState,
  (selectState: State) => selectState[field]
);

export const selectTasksSettings = () => createSelector(
  selectState,
  (selectState: State) => {
    return {
      hideDone: selectState['hideDoneTasks'],
      hideRejected: selectState['hideRejectedTasks']
    };
  }
);

export const selectNotificationLanguage = createSelector(
  selectState,
  (selectState: State) => selectState.notificationLanguage
);
