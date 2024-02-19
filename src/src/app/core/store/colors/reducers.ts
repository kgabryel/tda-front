import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import * as actions from './actions';
import {Color} from '../../models/color';


export interface State {
  colors: EntityState<Color>;
  loaded: boolean;
}

export const key = 'colors';
export const adapter: EntityAdapter<Color> = createEntityAdapter<Color>();
const initialState: State = {
  colors: adapter.getInitialState(),
  loaded: false
};
export const reducer = createReducer(
  initialState,
  on(actions.colorsLoad, (state) => state),
  on(actions.colorsLoadError, (state) => state),
  on(actions.colorsLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    colors: adapter.addMany(action.colors, state.colors)
  })),
  on(actions.colorAdd, (state) => state),
  on(actions.colorAddError, (state) => state),
  on(actions.colorAddSuccess, (state, action) => ({
    ...state,
    colors: adapter.addOne(action.color, state.colors)
  })),
  on(actions.colorDelete, (state) => state),
  on(actions.colorDeleteError, (state) => state),
  on(actions.colorDeleteSuccess, (state, action) => ({
    ...state,
    colors: adapter.removeOne(action.id, state.colors)
  })),
  on(actions.colorsReset, () => initialState)
);
