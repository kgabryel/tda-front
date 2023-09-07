import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {State} from '../store/tasks/reducers';
import {selectIsLoaded} from '../store/tasks/selectors';
import {tasksLoad} from '../store/tasks/actions';
import {bookmarksLoad} from '../store/bookmarks/actions';

@Injectable()
export class TasksResolver implements Resolve<boolean> {
  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    this.store.dispatch(tasksLoad());
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(bookmarksLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
