import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {NotificationTypesContainer} from '../containers/notification-types.container';
import {Store} from '@ngrx/store';
import {State} from '../store/notifications-types/reducers';
import {selectIsLoaded, selectTypes} from '../store/notifications-types/selectors';
import {notificationTypesLoad} from '../store/notifications-types/actions';

@Injectable()
export class NotificationTypesResolver implements Resolve<boolean> {
  private readonly store: Store<State>;
  private notificationTypesContainer: NotificationTypesContainer;

  constructor(store: Store<State>, notificationTypesContainer: NotificationTypesContainer) {
    this.store = store;
    this.notificationTypesContainer = notificationTypesContainer;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(notificationTypesLoad());
          this.store.select(selectTypes).subscribe(types => {
            this.notificationTypesContainer.setTypes(types);
          });
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
