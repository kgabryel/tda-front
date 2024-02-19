import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {State} from '../store/files/reducers';
import {filesLoad} from '../store/files/actions';
import {selectIsLoaded} from '../store/files/selectors';

@Injectable()
export class FilesResolver implements Resolve<boolean> {
  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(filesLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
