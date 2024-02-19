import {createAction, props} from '@ngrx/store';
import {Color} from '../../models/color';
import {ColorRequest} from '../../requests/color.request';
import {Actions, Prefixes} from '../actions.config';

export const colorsLoad = createAction(
  `${Prefixes.colors} ${Actions.load}`
);

export const colorsLoadError = createAction(
  `${Prefixes.colors} ${Actions.loadError}`
);

export const colorsLoadSuccess = createAction(
  `${Prefixes.colors} ${Actions.loadSuccess}`,
  props<{ colors: Color[] }>()
);

export const colorAdd = createAction(
  `${Prefixes.colors} ${Actions.add}`,
  props<{ color: ColorRequest }>()
);

export const colorAddError = createAction(
  `${Prefixes.colors} ${Actions.addError}`
);

export const colorAddSuccess = createAction(
  `${Prefixes.colors} ${Actions.addSuccess}`,
  props<{ color: Color }>()
);

export const colorDelete = createAction(
  `${Prefixes.colors} ${Actions.delete}`,
  props<{ id: number }>()
);

export const colorDeleteError = createAction(
  `${Prefixes.colors} ${Actions.deleteError}`
);

export const colorDeleteSuccess = createAction(
  `${Prefixes.colors} ${Actions.deleteSuccess}`,
  props<{ id: number }>()
);

export const colorsReset = createAction(
  `${Prefixes.colors} ${Actions.reset}`
);
