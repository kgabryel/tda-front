import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {selectSettings} from '../../store/settings/selectors';
import {Store} from '@ngrx/store';
import {State as SettingsState} from '../../store/settings/reducers';

export interface Search {
  name: string;
  content: string;
  type: boolean | null;
  task: boolean | null;
  catalogs: number[];
  status: boolean | null;
  startDate: Date | null;
  stopDate: Date | null;
}

@Injectable()
export class AlarmsSearchService {
  private search: BehaviorSubject<Search>;

  constructor(settingsStore: Store<SettingsState>) {
    settingsStore.select(selectSettings('hideInactiveAlarms')).subscribe(value => {
      this.search = new BehaviorSubject<Search>({
        name: '',
        content: '',
        type: null,
        task: null,
        catalogs: [],
        status: value ? false : null,
        startDate: null,
        stopDate: null
      });
    });
  }

  public searchAlarms(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
