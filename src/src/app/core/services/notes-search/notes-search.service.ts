import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Search {
  name: string;
  content: string;
  assignedToDashboard: boolean | null;
  catalogs: number[],
  tasks: string[]
}

@Injectable()
export class NotesSearchService {

  private search: BehaviorSubject<Search>;

  constructor() {
    this.search = new BehaviorSubject<Search>({
      name: '',
      content: '',
      assignedToDashboard: null,
      catalogs: [],
      tasks: []
    });
  }

  public searchNotes(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
