import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {alarmLoad} from '../store/alarms/actions';
import {selectIsLoaded} from '../store/alarms/selectors';
import {State} from '../store/alarms/reducers';

@Injectable()
export class AlarmsResolver implements Resolve<boolean> {
  private readonly store: Store<State>;

  constructor(store: Store<State>) {
    this.store = store;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(alarmLoad());
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
