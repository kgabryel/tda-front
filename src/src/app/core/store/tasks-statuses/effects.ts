import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import * as statusesActions from './actions';
import {TasksService} from '../../services/tasks/tasks.service';
import {BaseEffect} from '../BaseEffect';
import {NotificationService} from '../../services/notification/notification.service';

@Injectable()
export class TasksStatusesEffects extends BaseEffect<TasksService> {

  load;

  public constructor(actions: Actions, notificationService: NotificationService, service: TasksService) {
    super(actions, notificationService, service);
  }

  protected initEffects(): void {
    this.createLoadStatuses();
  }

  private createLoadStatuses(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(statusesActions.taskStatusLoad),
      switchMap((() => this.service.getStatuses().pipe(
        map((statuses => statusesActions.taskStatusLoadSuccess({statuses}))),
        catchError(error => this.error(error, statusesActions.taskStatusLoadError()))
      )))
    ));
  }
}
