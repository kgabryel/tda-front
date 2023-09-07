import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Search {
  name: string;
  extension: string;
  assignedToDashboard: boolean | null;
  catalogs: number[],
  tasks: string[]
}

@Injectable()
export class FilesSearchService {
  private search: BehaviorSubject<Search>;

  constructor() {
    this.search = new BehaviorSubject<Search>({
      name: '',
      extension: '',
      assignedToDashboard: null,
      catalogs: [],
      tasks: []
    });
  }

  public searchFiles(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
