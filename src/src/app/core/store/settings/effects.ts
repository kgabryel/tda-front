import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as settingsActions from './actions';
import {NotificationService} from '../../services/notification/notification.service';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {Router} from '@angular/router';
import {UserService} from '../../services/user/user.service';
import {BaseEffect} from '../BaseEffect';
import {PushNotificationService} from '../../services/push-notification/push-notification.service';


@Injectable()
export class SettingsEffects extends BaseEffect<UserService> {

  load;
  changeEmail;
  confirmEmail;
  changeSettings;
  private router: Router;
  private pushNotificationService: PushNotificationService;

  constructor(
    actions: Actions,
    notificationService: NotificationService,
    router: Router,
    service: UserService,
    pushNotificationService: PushNotificationService
  ) {
    super(actions, notificationService, service);
    this.router = router;
    this.pushNotificationService = pushNotificationService;
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createChangEmail();
    this.createConfirmEmail();
    this.createChangePagination();
  }

  private createLoadEffect(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(settingsActions.settingsLoad),
      switchMap((() => this.service.load().pipe(
        tap(settings => this.pushNotificationService.setPublicKey(settings.pushNotificationKey)),
        map((settings => settingsActions.settingsLoadSuccess({settings}))),
        catchError(error => this.error(error, settingsActions.settingsLoadError()))
      )))
    ));
  }

  private createChangEmail(): void {
    this.changeEmail = createEffect(() =>
      this.actions.pipe(
        ofType(settingsActions.changeEmail),
        switchMap(action => this.service.changeEmail(action.email).pipe(
          tap(() => this.notificationService.showMessage('messages.emailChanged')),
          map((settings => settingsActions.changeEmailSuccess({settings}))),
          catchError(error => this.error(error, settingsActions.changeEmailError()))
        ))
      ));
  }

  private createConfirmEmail(): void {
    this.confirmEmail = createEffect(() => this.actions.pipe(
      ofType(settingsActions.confirmEmail),
      switchMap(((action) => this.service.confirmEmail(action.code).pipe(
        tap(() => {
          this.notificationService.showMessage('messages.emailConfirmed');
          this.router.navigate([PathUtils.concatPath(RoutingConfig.settings)]);
        }),
        map((settings => settingsActions.confirmEmailSuccess({settings}))),
        catchError(error => this.error(error, settingsActions.confirmEmailError()))
      )))
    ));
  }

  private createChangePagination(): void {
    this.changeSettings = createEffect(() => this.actions.pipe(
      ofType(settingsActions.changeSettings),
      switchMap(((action) => this.service.changeSettings(action.field, action.value).pipe(
        tap(() => this.notificationService.showMessage('messages.settingsUpdated')),
        map((settings => settingsActions.changeSettingsSuccess({field: settings.field, value: settings.value}))),
        catchError(error => this.error(error, settingsActions.changeSettingsError()))
      )))
    ));
  }
}
