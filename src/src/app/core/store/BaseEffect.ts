import {Actions} from '@ngrx/effects';
import {NotificationService} from '../services/notification/notification.service';
import {of} from 'rxjs';

export abstract class BaseEffect<T> {
  protected actions: Actions;
  protected notificationService: NotificationService;
  protected service: T;

  protected constructor(actions: Actions, notificationService: NotificationService, service: T) {
    this.actions = actions;
    this.notificationService = notificationService;
    this.service = service;
    this.initEffects();
  }

  protected abstract initEffects(): void;

  protected error(error, errorAction) {
    this.notificationService.showError(error.status);
    return of(errorAction);
  }
}
