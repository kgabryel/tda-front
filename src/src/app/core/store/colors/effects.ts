import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as colorsActions from './actions';
import {NotificationService} from '../../services/notification/notification.service';
import {ColorsService} from '../../services/colors/colors.service';
import {BaseEffect} from '../BaseEffect';


@Injectable()
export class ColorsEffects extends BaseEffect<ColorsService> {

  load;
  add;
  delete;

  constructor(actions: Actions, notificationService: NotificationService, service: ColorsService) {
    super(actions, notificationService, service);
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
  }

  private createLoadEffect(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(colorsActions.colorsLoad),
      switchMap((() => this.service.getAll().pipe(
        map((colors => colorsActions.colorsLoadSuccess({colors}))),
        catchError(error => this.error(error, colorsActions.colorsLoadError()))
      )))
    ));
  }

  private createAddEffect(): void {
    this.add = createEffect(() =>
      this.actions.pipe(
        ofType(colorsActions.colorAdd),
        switchMap(action => this.service.add(action.color).pipe(
          tap(() => this.notificationService.showMessage('messages.colorAdded')),
          map((color => colorsActions.colorAddSuccess({color}))),
          catchError(error => this.error(error, colorsActions.colorAddError()))
        ))
      ));
  }

  private createDeleteEffect(): void {
    this.delete = createEffect(() => this.actions.pipe(
      ofType(colorsActions.colorDelete),
      switchMap(((action) => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.colorDeleted')),
        map((id => colorsActions.colorDeleteSuccess({id}))),
        catchError(error => this.error(error, colorsActions.colorDeleteError()))
      )))
    ));
  }
}
