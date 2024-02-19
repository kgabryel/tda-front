import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface Search {
  name: string;
  assignedToDashboard: boolean | null;
  watched: boolean | null;
  catalogs: number[],
  tasks: string[]
}

@Injectable()
export class VideosSearchService {
  private search: BehaviorSubject<Search>;

  constructor() {
    this.search = new BehaviorSubject<Search>({
      name: '',
      assignedToDashboard: null,
      watched: null,
      catalogs: [],
      tasks: []
    });
  }

  public searchVideos(search: Search): void {
    this.search.next(search);
  }

  public getState(): Observable<Search> {
    return this.search.asObservable();
  }
}
