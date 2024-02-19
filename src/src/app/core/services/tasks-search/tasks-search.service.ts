import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {State as SettingsState} from '../../store/settings/reducers';
import {selectTasksSettings} from '../../store/settings/selectors';

export interface Search {
  name: string;
  content: string;
  type: boolean | null;
  alarm: boolean | null;
  catalogs: number[];
  hideDone: boolean | null;
  hideRejected: boolean | null;
  statuses: number[];
  startDate: Date | null;
  stopDate: Date | null;
  date: boolean | null;
  subtasks: boolean | null;
  notes: number[];
  bookmarks: number[];
  files: number[];
  videos: number[];
  active: boolean | null;
}

@Injectable()
export class TasksSearchService {
  private search: BehaviorSubject<Search>;

  constructor(settingsStore: Store<SettingsState>) {
    settingsStore.select(selectTasksSettings()).subscribe(value => {
      this.search = new BehaviorSubject<Search>({
        name: '',
        content: '',
        type: null,
        alarm: null,
        catalogs: [],
        hideDone: value.hideDone,
        hideRejected: value.hideRejected,
        statuses: [],
        startDate: null,
        stopDate: null,
        date: null,
        subtasks: null,
        notes: [],
        bookmarks: [],
        files: [],
        videos: [],
        active: null
      });
    });
  }

  public searchTasks(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
