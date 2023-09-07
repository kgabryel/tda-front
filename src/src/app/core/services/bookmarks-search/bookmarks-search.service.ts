import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Search {
  name: string;
  href: string;
  assignedToDashboard: boolean | null;
  catalogs: number[],
  tasks: string[]
}

@Injectable()
export class BookmarksSearchService {
  private search: BehaviorSubject<Search>;

  constructor() {
    this.search = new BehaviorSubject<Search>({
      name: '',
      href: '',
      assignedToDashboard: null,
      catalogs: [],
      tasks: []
    });
  }

  public searchBookmarks(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
