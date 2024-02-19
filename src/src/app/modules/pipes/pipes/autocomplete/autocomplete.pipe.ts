import {Pipe, PipeTransform} from '@angular/core';
import {Store} from '@ngrx/store';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {selectSettings} from '../../../../core/store/settings/selectors';

@Pipe({
  name: 'autocomplete'
})
export class AutocompletePipe implements PipeTransform {

  private autocomplete: boolean;

  public constructor(settingsStore: Store<SettingsState>) {
    this.autocomplete = true;
    settingsStore.select(selectSettings('autocomplete')).subscribe(autocomplete => this.autocomplete = autocomplete);
  }

  public transform(value: unknown): string {
    return this.autocomplete ? 'on' : 'off';
  }
}
