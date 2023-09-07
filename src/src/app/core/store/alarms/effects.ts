import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as alarmsActions from './actions';
import {AlarmsService} from '../../services/alarms/alarms.service';
import {NotificationService} from '../../services/notification/notification.service';
import {Update} from '@ngrx/entity';
import {Alarm} from '../../models/alarm';
import {Router} from '@angular/router';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {Store} from '@ngrx/store';
import {State} from './reducers';
import {EventsService} from '../../services/events/events.service';
import {selectAlarms} from './selectors';
import {EffectsWithReload} from '../EffectsWithReload';


@Injectable()
export class AlarmsEffects extends EffectsWithReload<AlarmsService, State> {

  load;
  reload;
  addSingle;
  addPeriodic;
  checkAlarm;
  checkNotification;
  uncheckAlarm;
  uncheckNotification;
  deleteSingle;
  deletePeriodic;
  deleteNotification;
  disable;
  addNotification;
  addNotificationsGroup;
  modifySingleName;
  modifyPeriodicName;
  modifySingleContent;
  modifyPeriodicContent;
  modifyTask;
  removeCatalog;
  addCatalog;
  activateAlarmPeriodic;
  deactivateAlarmPeriodic;

  private router: Router;

  constructor(
    actions: Actions,
    service: AlarmsService,
    notificationService: NotificationService,
    router: Router,
    store: Store<State>,
    eventsService: EventsService
  ) {
    super(store, eventsService, actions, notificationService, service);
    this.router = router;
  }

  private static alarmUpdateSuccess(alarm: Alarm, id: string) {
    const update: Update<Alarm> = {id, changes: alarm};
    return alarmsActions.alarmsUpdateSuccess({alarm: update});
  }

  protected initEffects(): void {
    this.createLoadAlarms();
    this.createReloadEffect();
    this.createAddSingleAlarm();
    this.createAddPeriodicAlarm();
    this.createCheckAlarm();
    this.createCheckNotification();
    this.createUncheckAlarm();
    this.createUncheckNotification();
    this.createDeleteSingleAlarm();
    this.createDeletePeriodicAlarm();
    this.createDeleteNotification();
    this.createDisableAlarm();
    this.createAddNotificationEffect();
    this.createAddNotificationsGroupEffect();
    this.createModifySingleNameEffect();
    this.createModifySingleContentEffect();
    this.createModifyTaskEffect();
    this.createModifyPeriodicNameEffect();
    this.createModifyPeriodicContentEffect();
    this.createRemoveCatalogEffect();
    this.createAddCatalogEffect();
    this.createActivatePeriodicAlarm();
    this.createDeactivatePeriodicAlarm();
  }

  protected watchChanges(): void {
    this.eventsService.subscribeAlarmsChanges(data => {
      if (data.modifiedData.length > 0) {
        this.store.dispatch(alarmsActions.alarmsReload({selected: data.modifiedData}));
      }
    });
  }

  private createDeleteSingleAlarm(): void {
    this.deleteSingle = createEffect(() => this.actions.pipe(
      ofType(alarmsActions.alarmSingleDelete),
      switchMap(((action) => this.service.deleteAlarm(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.alarmDeleted')),
        map((id => alarmsActions.alarmDeleteSuccess({alarms: [id]}))),
        catchError(error => this.error(error, alarmsActions.alarmDeleteError()))
      )))
    ));
  }

  private createDeletePeriodicAlarm(): void {
    this.deletePeriodic = createEffect(() => this.actions.pipe(
      ofType(alarmsActions.alarmPeriodicDelete),
      switchMap(((action) => this.service.deleteAlarm(action.id, action.delete).pipe(
        tap(() => this.notificationService.showMessage('messages.alarmDeleted')),
        switchMap(id => this.store.select(selectAlarms).pipe(
          map(alarms => alarms.filter(alarm => alarm.id === id || (action.delete && alarm.group === id)).map(alarm => alarm.id))
        )),
        map(alarms => alarmsActions.alarmDeleteSuccess({alarms: alarms})),
        catchError(error => this.error(error, alarmsActions.alarmDeleteError()))
      )))
    ));
  }

  private createActivatePeriodicAlarm(): void {
    this.activateAlarmPeriodic = createEffect(() => this.actions.pipe(
      ofType(alarmsActions.alarmPeriodicActivate),
      switchMap(((action) => this.service.activatePeriodicAlarm(action.id, action.action).pipe(
        tap(() => this.notificationService.showMessage('messages.alarmUpdated')),
        map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.id))),
        catchError(error => this.error(error, alarmsActions.alarmsUpdateError()))
      )))
    ));
  }

  private createDeactivatePeriodicAlarm(): void {
    this.deactivateAlarmPeriodic = createEffect(() => this.actions.pipe(
      ofType(alarmsActions.alarmPeriodicDeactivate),
      switchMap(((action) => this.service.deactivatePeriodicAlarm(action.id, action.action).pipe(
        tap(() => this.notificationService.showMessage('messages.alarmUpdated')),
        map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.id))),
        catchError(error => this.error(error, alarmsActions.alarmsUpdateError()))
      )))
    ));
  }

  private createDeleteNotification(): void {
    this.deleteNotification = createEffect(() => this.actions.pipe(
      ofType(alarmsActions.notificationDelete),
      switchMap(((action) => this.service.deleteNotification(action.alarm, action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.notificationDeleted')),
        map((alarm => {
          if (typeof alarm === 'string') {
            return alarmsActions.alarmDeleteSuccess({alarms: [alarm]});
          }
          return AlarmsEffects.alarmUpdateSuccess(alarm, alarm.id);
        })),
        catchError(error => this.error(error, alarmsActions.notificationDeleteError()))
      )))
    ));
  }

  private createCheckAlarm(): void {
    this.checkAlarm = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmCheck),
        switchMap(action => this.service.checkAlarm(action.id).pipe(
          tap(alarm => this.notificationService.showMessage(alarm === null ? 'messages.alarmNotModified' : 'messages.alarmDisabled')),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.id))),
          catchError(error => this.error(error, alarmsActions.alarmCheckError()))
        ))
      ));
  }

  private createUncheckAlarm(): void {
    this.uncheckAlarm = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmUncheck),
        switchMap(action => this.service.uncheckAlarm(action.id).pipe(
          tap(alarm => this.notificationService.showMessage(alarm === null ? 'messages.alarmAfterTime' : 'messages.alarmActivated')),
          map((alarm => {
            if (alarm === null) {
              return alarmsActions.alarmUncheckUnmodified();
            }
            return AlarmsEffects.alarmUpdateSuccess(alarm, alarm.id);
          })),
          catchError(error => this.error(error, alarmsActions.alarmUncheckError()))
        ))
      ));
  }

  private createUncheckNotification(): void {
    this.uncheckNotification = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.notificationUncheck),
        switchMap(action => this.service.uncheckNotification(action.id).pipe(
          tap(alarm => this.notificationService.showMessage(alarm === null ? 'messages.notificationAfterTime' : 'messages.notificationActivated')),
          map((alarm => {
            if (alarm === null) {
              return alarmsActions.notificationUncheckUnmodified();
            }
            return AlarmsEffects.alarmUpdateSuccess(alarm, alarm.id);
          })),
          catchError(error => this.error(error, alarmsActions.notificationUncheckError()))
        ))
      ));
  }

  private createCheckNotification(): void {
    this.checkNotification = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.notificationCheck),
        switchMap(action => this.service.checkNotification(action.id).pipe(
          tap(() => this.notificationService.showMessage('messages.notificationDisabled')),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, alarm.id))),
          catchError(error => this.error(error, alarmsActions.notificationCheckError()))
        ))
      ));
  }

  private createLoadAlarms(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(alarmsActions.alarmLoad),
      switchMap((() => this.service.getAll().pipe(
        map((alarms => alarmsActions.alarmLoadSuccess({alarms}))),
        catchError(error => this.error(error, alarmsActions.alarmLoadError()))
      )))
    ));
  }

  private createReloadEffect(): void {
    this.reload = createEffect(() => this.actions.pipe(
      ofType(alarmsActions.alarmsReload),
      switchMap(((action) => this.service.getSelected(action.selected).pipe(
        tap(alarms => this.store.dispatch(alarmsActions.alarmDeleteSuccess({
          alarms: action.selected.filter(x => !alarms.map(alarm => alarm.id).includes(x))
        }))),
        map((alarms => alarmsActions.alarmsReloadSuccess({alarms}))),
        catchError(error => this.error(error, alarmsActions.alarmsReloadError()))
      )))
    ));
  }

  private createAddSingleAlarm(): void {
    this.addSingle = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmsSingleAdd),
        switchMap(action => this.service.createSingle(action.alarm).pipe(
          tap((alarm) => {
            this.notificationService.showMessage('messages.alarmAdded');
            if (action.redirect) {
              this.router.navigate([PathUtils.concatPath(RoutingConfig.alarms, alarm.id)]);
            }
          }),
          map((alarm => alarmsActions.alarmsAddSuccess({alarm}))),
          catchError(error => this.error(error, alarmsActions.alarmsAddError()))
        ))
      ));
  }

  private createAddPeriodicAlarm(): void {
    this.addPeriodic = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmsPeriodicAdd),
        switchMap(action => this.service.createPeriodic(action.alarm).pipe(
          tap((alarm) => {
            this.notificationService.showMessage('messages.alarmAdded');
            if (action.redirect) {
              this.router.navigate([PathUtils.concatPath(RoutingConfig.alarms, alarm.id)]);
            }
          }),
          map((alarm => alarmsActions.alarmsAddSuccess({alarm}))),
          catchError(error => this.error(error, alarmsActions.alarmsAddError()))
        ))
      ));
  }

  private createDisableAlarm(): void {
    this.disable = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmSingleDisable),
        switchMap(action => this.service.disableAlarm(action.code).pipe(
          tap(alarm => {
            if (alarm === null) {
              this.notificationService.showMessage('messages.alarmNotModified');
            } else {
              this.notificationService.showMessage('messages.alarmDisabled');
            }
            this.router.navigate([PathUtils.concatPath(RoutingConfig.alarms)]);
          }),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, alarm.id))),
          catchError(error => this.error(error, alarmsActions.alarmDisableError()))
        ))
      ));
  }

  private createAddNotificationEffect(): void {
    this.addNotification = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.notificationAdd),
        switchMap(action => this.service.createNotification(action.alarmId, action.notification).pipe(
          tap(() => this.notificationService.showMessage('messages.notificationAdded')),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.alarmId))),
          catchError(error => this.error(error, alarmsActions.notificationAddError()))
        ))
      ));
  }

  private createAddNotificationsGroupEffect(): void {
    this.addNotificationsGroup = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.notificationGroupAdd),
        switchMap(action => this.service.createNotificationGroup(action.alarmId, action.notification).pipe(
          tap(() => this.notificationService.showMessage('messages.notificationAdded')),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.alarmId))),
          catchError(error => this.error(error, alarmsActions.notificationAddError()))
        ))
      ));
  }

  private createModifySingleNameEffect(): void {
    this.modifySingleName = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmsSingleNameUpdate),
        switchMap(action => this.service.updateName(action.id, action.name, false).pipe(
          tap(() => this.notificationService.showMessage('messages.alarmUpdated')),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.id))),
          catchError(error => this.error(error, alarmsActions.alarmsUpdateError()))
        ))
      ));
  }

  private createModifyPeriodicNameEffect(): void {
    this.modifyPeriodicName = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmsPeriodicNameUpdate),
        switchMap(action => this.service.updateName(action.id, action.name, true).pipe(
          tap(() => this.notificationService.showMessage('messages.alarmUpdated')),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.id))),
          catchError(error => this.error(error, alarmsActions.alarmsUpdateError()))
        ))
      ));
  }

  private createModifySingleContentEffect(): void {
    this.modifySingleContent = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmsSingleContentUpdate),
        switchMap(action => this.service.updateContent(action.id, action.content, false).pipe(
          tap(() => this.notificationService.showMessage('messages.alarmUpdated')),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.id))),
          catchError(error => this.error(error, alarmsActions.alarmsUpdateError()))
        ))
      )
    );
  }

  private createModifyPeriodicContentEffect(): void {
    this.modifyPeriodicContent = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmsPeriodicContentUpdate),
        switchMap(action => this.service.updateContent(action.id, action.content, true).pipe(
          tap(() => this.notificationService.showMessage('messages.alarmUpdated')),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.id))),
          catchError(error => this.error(error, alarmsActions.alarmsUpdateError()))
        ))
      )
    );
  }

  private createModifyTaskEffect(): void {
    this.modifyTask = createEffect(() =>
      this.actions.pipe(
        ofType(alarmsActions.alarmsSingleTaskUpdate),
        switchMap(action => this.service.updateTask(action.id, action.task).pipe(
          tap(() => this.notificationService.showMessage('messages.alarmUpdated')),
          map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.id))),
          catchError(error => this.error(error, alarmsActions.alarmsUpdateError()))
        ))
      )
    );
  }

  private createRemoveCatalogEffect(): void {
    this.removeCatalog = createEffect(() => this.actions.pipe(
      ofType(alarmsActions.catalogRemove),
      switchMap(((action) => this.service.undoCatalog(action.alarmId, action.catalogId).pipe(
        tap(() => this.notificationService.showMessage('messages.catalogRemoved')),
        map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.alarmId))),
        catchError(error => this.error(error, alarmsActions.alarmsUpdateError()))
      )))
    ));
  }

  private createAddCatalogEffect(): void {
    this.addCatalog = createEffect(() => this.actions.pipe(
      ofType(alarmsActions.catalogAdd),
      switchMap(((action) => this.service.addCatalog(action.alarmId, action.catalogId).pipe(
        tap(() => this.notificationService.showMessage('messages.catalogAdded')),
        map((alarm => AlarmsEffects.alarmUpdateSuccess(alarm, action.alarmId))),
        catchError(error => this.error(error, alarmsActions.alarmsUpdateError()))
      )))
    ));
  }
}
