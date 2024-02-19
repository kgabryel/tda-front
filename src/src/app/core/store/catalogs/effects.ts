import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as catalogsActions from './actions';
import {NotificationService} from '../../services/notification/notification.service';
import {CatalogsService} from '../../services/catalogs/catalogs.service';
import {Update} from '@ngrx/entity';
import {Catalog} from '../../models/catalog';
import {EventsService} from '../../services/events/events.service';
import {Store} from '@ngrx/store';
import {State} from './reducers';
import {EffectsWithReload} from '../EffectsWithReload';


@Injectable()
export class CatalogsEffects extends EffectsWithReload<CatalogsService, State> {

  load;
  reload;
  add;
  delete;
  update;
  removeAlarm;
  removeTask;
  removeNote;
  removeBookmark;
  removeFile;
  removeVideo;
  undoFromDashboard;

  constructor(
    actions: Actions,
    service: CatalogsService,
    notificationService: NotificationService,
    store: Store<State>,
    eventsService: EventsService
  ) {
    super(store, eventsService, actions, notificationService, service);
  }

  private static catalogUpdateSuccess(catalog: Catalog, id: number) {
    const update: Update<Catalog> = {id, changes: catalog};
    return catalogsActions.catalogUpdateSuccess({catalog: update});
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createReloadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
    this.createRemoveAlarmEffect();
    this.createRemoveTaskEffect();
    this.createRemoveNoteEffect();
    this.createRemoveBookmarkEffect();
    this.createRemoveFileEffect();
    this.createRemoveVideoEffect();
    this.createUndoFromDashboardEffect();
  }

  protected watchChanges(): void {
    this.eventsService.subscribeCatalogsChanges(data => {
      if (data.modifiedData.length > 0) {
        this.store.dispatch(catalogsActions.catalogsReload({selected: data.modifiedData}));
      }
    });
  }

  private createLoadEffect(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.catalogsLoad),
      switchMap((() => this.service.getAll().pipe(
        map((catalogs => catalogsActions.catalogsLoadSuccess({catalogs}))),
        catchError(error => this.error(error, catalogsActions.catalogsLoadError()))
      )))
    ));
  }

  private createReloadEffect(): void {
    this.reload = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.catalogsReload),
      switchMap(((action) => this.service.getSelected(action.selected).pipe(
        tap(catalogs => action.selected.filter(x => !catalogs.map(catalog => catalog.id).includes(x))
          .forEach(id => this.store.dispatch(catalogsActions.catalogDeleteSuccess({id})))),
        map((catalogs => catalogsActions.catalogsReloadSuccess({catalogs}))),
        catchError(error => this.error(error, catalogsActions.catalogsReloadError()))
      )))
    ));
  }

  private createAddEffect(): void {
    this.add = createEffect(() =>
      this.actions.pipe(
        ofType(catalogsActions.catalogAdd),
        switchMap(action => this.service.add(action.catalog).pipe(
          tap(() => this.notificationService.showMessage('messages.catalogAdded')),
          map((catalog => catalogsActions.catalogAddSuccess({catalog}))),
          catchError(error => this.error(error, catalogsActions.catalogAddError()))
        ))
      ));
  }

  private createDeleteEffect(): void {
    this.delete = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.catalogDelete),
      switchMap(((action) => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.catalogDeleted')),
        map((id => catalogsActions.catalogDeleteSuccess({id}))),
        catchError(error => this.error(error, catalogsActions.catalogDeleteError()))
      )))
    ));
  }

  private createUpdateEffect(): void {
    this.update = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.catalogUpdate),
      switchMap(((action) => this.service.update(action.id, action.catalog).pipe(
        tap(() => this.notificationService.showMessage('messages.catalogUpdated')),
        map((catalog => CatalogsEffects.catalogUpdateSuccess(catalog, action.id))),
        catchError(error => this.error(error, catalogsActions.catalogUpdateError()))
      )))
    ));
  }

  private createRemoveAlarmEffect(): void {
    this.removeAlarm = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.alarmRemove),
      switchMap(((action) => this.service.undo(action.catalogId, action.alarmId, 'alarms').pipe(
        tap(() => this.notificationService.showMessage('messages.alarmRemoved')),
        map((catalog => CatalogsEffects.catalogUpdateSuccess(catalog, action.catalogId))),
        catchError(error => this.error(error, catalogsActions.catalogUpdateError()))
      )))
    ));
  }

  private createRemoveTaskEffect(): void {
    this.removeTask = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.taskRemove),
      switchMap(((action) => this.service.undo(action.catalogId, action.taskId, 'tasks').pipe(
        tap(() => this.notificationService.showMessage('messages.taskRemoved')),
        map((catalog => CatalogsEffects.catalogUpdateSuccess(catalog, action.catalogId))),
        catchError(error => this.error(error, catalogsActions.catalogUpdateError()))
      )))
    ));
  }

  private createRemoveNoteEffect(): void {
    this.removeNote = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.noteRemove),
      switchMap(((action) => this.service.undo(action.catalogId, action.noteId, 'notes').pipe(
        tap(() => this.notificationService.showMessage('messages.noteRemoved')),
        map((catalog => CatalogsEffects.catalogUpdateSuccess(catalog, action.catalogId))),
        catchError(error => this.error(error, catalogsActions.catalogUpdateError()))
      )))
    ));
  }

  private createRemoveBookmarkEffect(): void {
    this.removeBookmark = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.bookmarkRemove),
      switchMap(((action) => this.service.undo(action.catalogId, action.bookmarkId, 'bookmarks').pipe(
        tap(() => this.notificationService.showMessage('messages.bookmarkRemoved')),
        map((catalog => CatalogsEffects.catalogUpdateSuccess(catalog, action.catalogId))),
        catchError(error => this.error(error, catalogsActions.catalogUpdateError()))
      )))
    ));
  }

  private createRemoveFileEffect(): void {
    this.removeFile = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.fileRemove),
      switchMap(((action) => this.service.undo(action.catalogId, action.fileId, 'files').pipe(
        tap(() => this.notificationService.showMessage('messages.fileRemoved')),
        map((catalog => CatalogsEffects.catalogUpdateSuccess(catalog, action.catalogId))),
        catchError(error => this.error(error, catalogsActions.catalogUpdateError()))
      )))
    ));
  }

  private createRemoveVideoEffect(): void {
    this.removeVideo = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.videoRemove),
      switchMap(((action) => this.service.undo(action.catalogId, action.videoId, 'videos').pipe(
        tap(() => this.notificationService.showMessage('messages.videoRemoved')),
        map((catalog => CatalogsEffects.catalogUpdateSuccess(catalog, action.catalogId))),
        catchError(error => this.error(error, catalogsActions.catalogUpdateError()))
      )))
    ));
  }

  private createUndoFromDashboardEffect(): void {
    this.undoFromDashboard = createEffect(() => this.actions.pipe(
      ofType(catalogsActions.catalogUndoFromDashboard),
      switchMap(((action) => this.service.undoFromDashboard(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.undoFromDashboard')),
        map((catalog => CatalogsEffects.catalogUpdateSuccess(catalog, action.id))),
        catchError(error => this.error(error, catalogsActions.catalogUpdateError()))
      )))
    ));
  }
}
