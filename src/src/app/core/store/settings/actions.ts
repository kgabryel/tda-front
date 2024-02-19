import {createAction, props} from '@ngrx/store';
import {Actions, Prefixes} from '../actions.config';
import {EmailSettings, Settings} from '../../models/settings';

export const settingsLoad = createAction(
  `${Prefixes.settings} ${Actions.load}`
);

export const settingsLoadError = createAction(
  `${Prefixes.settings} ${Actions.loadError}`
);

export const settingsLoadSuccess = createAction(
  `${Prefixes.settings} ${Actions.loadSuccess}`,
  props<{ settings: Settings }>()
);

export const changeEmail = createAction(
  `${Prefixes.settings} ${Actions.changeEmail}`,
  props<{ email: string | null }>()
);

export const changeEmailError = createAction(
  `${Prefixes.settings} ${Actions.changeEmailError}`
);

export const changeEmailSuccess = createAction(
  `${Prefixes.settings} ${Actions.changeEmailSuccess}`,
  props<{ settings: EmailSettings }>()
);

export const confirmEmail = createAction(
  `${Prefixes.settings} ${Actions.confirmEmail}`,
  props<{ code: string }>()
);

export const confirmEmailError = createAction(
  `${Prefixes.settings} ${Actions.confirmEmailError}`
);

export const confirmEmailSuccess = createAction(
  `${Prefixes.settings} ${Actions.confirmEmailSuccess}`,
  props<{ settings: EmailSettings }>()
);

export const changeSettings = createAction(
  `${Prefixes.settings} ${Actions.changeSettings}`,
  props<{ field: string, value: number | boolean }>()
);

export const changeSettingsError = createAction(
  `${Prefixes.settings} ${Actions.changeSettingsError}`
);

export const changeSettingsSuccess = createAction(
  `${Prefixes.settings} ${Actions.changeSettingsSuccess}`,
  props<{ field: string, value: number | boolean }>()
);

export const settingsReset = createAction(
  `${Prefixes.settings} ${Actions.reset}`
);
