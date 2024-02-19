import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, timer} from 'rxjs';
import {RoutingConfig} from '../../../config/routing.config';
import {debounce} from 'rxjs/operators';

@Injectable()
export class SearchService {

  private search: BehaviorSubject<boolean>;
  private searchStart: BehaviorSubject<boolean>;

  constructor() {
    this.search = new BehaviorSubject<boolean>(false);
    this.searchStart = new BehaviorSubject<boolean>(false);
  }

  public static searchIsActive(url: string): boolean {
    const searchableUrl = [
      '/' + RoutingConfig.catalogs,
      '/' + RoutingConfig.tasks,
      '/' + RoutingConfig.alarms,
      '/' + RoutingConfig.notes,
      '/' + RoutingConfig.bookmarks,
      '/' + RoutingConfig.files,
      '/' + RoutingConfig.videos
    ];
    return searchableUrl.includes(url);
  }

  public updateSearch(state: boolean): void {
    this.search.next(state);
  }

  public getState(): Observable<boolean> {
    return this.search.asObservable().pipe(debounce(() => timer(200)));
  }

  public getSearchState(): Observable<boolean> {
    return this.searchStart.asObservable();
  }

  public startSearch(): void {
    this.searchStart.next(true);
  }
}
