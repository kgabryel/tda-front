import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap} from 'rxjs/operators';
import {NotificationTypesService} from '../../services/notification-types/notification-types.service';
import * as typesActions from './actions';
import {BaseEffect} from '../BaseEffect';
import {NotificationService} from '../../services/notification/notification.service';

@Injectable()
export class NotificationsTypesEffects extends BaseEffect<NotificationTypesService> {

  load;

  public constructor(actions: Actions, notificationService: NotificationService, service: NotificationTypesService) {
    super(actions, notificationService, service);
  }

  protected initEffects(): void {
    this.createLoadStatuses();
  }

  private createLoadStatuses(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(typesActions.notificationTypesLoad),
      switchMap((() => this.service.getAll().pipe(
        map((notificationTypes => typesActions.notificationTypesLoadSuccess({notificationTypes}))),
        catchError(error => this.error(error, typesActions.notificationTypesLoadError()))
      )))
    ));
  }
}
