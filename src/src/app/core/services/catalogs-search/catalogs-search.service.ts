import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Search {
  name: string;
  assignedToDashboard: boolean | null;
  tasks: string[];
  alarms: string[];
  notes: number[];
  bookmarks: number[];
  files: number[];
  videos: number[];
}

@Injectable()
export class CatalogsSearchService {
  private search: BehaviorSubject<Search>;

  constructor() {
    this.search = new BehaviorSubject<Search>({
      name: '',
      assignedToDashboard: null,
      alarms: [],
      tasks: [],
      notes: [],
      bookmarks: [],
      files: [],
      videos: []
    });
  }

  public searchCatalogs(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
