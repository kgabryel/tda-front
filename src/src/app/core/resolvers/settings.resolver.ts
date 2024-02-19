import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {settingsLoad} from '../store/settings/actions';
import {selectIsLoaded} from '../store/settings/selectors';
import {State} from '../store/settings/reducers';

@Injectable()
export class SettingsResolver implements Resolve<boolean> {
  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(settingsLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
