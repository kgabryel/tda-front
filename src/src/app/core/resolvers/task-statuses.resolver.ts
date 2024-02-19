import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {Injectable} from '@angular/core';
import {filter, take, tap} from 'rxjs/operators';
import {TaskStatusContainer} from '../containers/task-status.container';
import {State} from '../store/tasks-statuses/reducers';
import {selectIsLoaded, selectStatuses} from '../store/tasks-statuses/selectors';
import {taskStatusLoad} from '../store/tasks-statuses/actions';

@Injectable()
export class TaskStatusesResolver implements Resolve<boolean> {
  private readonly store: Store<State>;
  private taskStatusContainer: TaskStatusContainer;

  constructor(store: Store<State>, taskStatusContainer: TaskStatusContainer) {
    this.store = store;
    this.taskStatusContainer = taskStatusContainer;
  }

  resolve(): Observable<boolean> {
    return this.store.select(selectIsLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(taskStatusLoad());
          this.store.select(selectStatuses).subscribe(taskStatuses => {
            this.taskStatusContainer.setStatuses(taskStatuses);
          });
        }
      }),
      filter(loaded => loaded),
      take(1)
    );
  }
}
