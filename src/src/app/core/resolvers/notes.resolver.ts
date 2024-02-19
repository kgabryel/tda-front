import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {selectIsLoaded} from '../store/notes/selectors';
import {notesLoad} from '../store/notes/actions';
import {State} from '../store/notes/reducers';

@Injectable()
export class NotesResolver implements Resolve<boolean> {
  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(notesLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
