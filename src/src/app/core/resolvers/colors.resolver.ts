import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {State} from '../store/colors/reducers';
import {colorsLoad} from '../store/colors/actions';
import {selectIsLoaded} from '../store/colors/selectors';

@Injectable()
export class ColorsResolver implements Resolve<boolean> {
  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(colorsLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
