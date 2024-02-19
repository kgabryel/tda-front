import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as filesActions from './actions';
import {FilesService} from '../../services/files/files.service';
import {Update} from '@ngrx/entity';
import {State} from './reducers';
import {File} from '../../models/file';
import {EffectsWithReload} from '../EffectsWithReload';
import {NotificationService} from '../../services/notification/notification.service';
import {Store} from '@ngrx/store';
import {EventsService} from '../../services/events/events.service';

@Injectable()
export class FilesEffects extends EffectsWithReload<FilesService, State> {

  load;
  reload;
  add;
  update;
  delete;
  undoFromDashboard;
  replace;

  public constructor(
    store: Store<State>,
    eventsService: EventsService,
    actions: Actions,
    notificationService: NotificationService,
    service: FilesService
  ) {
    super(store, eventsService, actions, notificationService, service);
  }

  private static fileUpdateSuccess(file: File, id: number) {
    const update: Update<File> = {id, changes: file};
    return filesActions.fileUpdateSuccess({file: update});
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createReloadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
    this.createUndoFromDashboardEffect();
    this.createReplaceEffect();
  }

  protected watchChanges(): void {
    this.eventsService.subscribeFilesChanges(data => {
      if (data.modifiedData.length > 0) {
        this.store.dispatch(filesActions.filesReload({selected: data.modifiedData}));
      }
    });
  }

  private createLoadEffect(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(filesActions.filesLoad),
      switchMap((() => this.service.getAll().pipe(
        map((files => filesActions.filesLoadSuccess({files}))),
        catchError(error => this.error(error, filesActions.filesLoadError()))
      )))
    ));
  }

  private createReloadEffect(): void {
    this.reload = createEffect(() => this.actions.pipe(
      ofType(filesActions.filesReload),
      switchMap(((action) => this.service.getSelected(action.selected).pipe(
        tap(files => action.selected.filter(x => !files.map(file => file.id).includes(x))
          .forEach(id => this.store.dispatch(filesActions.fileDeleteSuccess({id})))),
        map((files => filesActions.filesReloadSuccess({files}))),
        catchError(error => this.error(error, filesActions.filesReloadError()))
      )))
    ));
  }

  private createAddEffect(): void {
    this.add = createEffect(() =>
      this.actions.pipe(
        ofType(filesActions.fileAdd),
        switchMap(action => this.service.add(action.file).pipe(
          tap(() => this.notificationService.showMessage('messages.fileAdded')),
          map((file => filesActions.fileAddSuccess({file}))),
          catchError(error => this.error(error, filesActions.fileAddError()))
        ))
      ));
  }

  private createDeleteEffect(): void {
    this.delete = createEffect(() => this.actions.pipe(
      ofType(filesActions.fileDelete),
      switchMap((action => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.fileDeleted')),
        map((id => filesActions.fileDeleteSuccess({id}))),
        catchError(error => this.error(error, filesActions.fileDeleteError()))
      )))
    ));
  }

  private createUpdateEffect(): void {
    this.update = createEffect(() => this.actions.pipe(
      ofType(filesActions.fileUpdate),
      switchMap(((action) => this.service.updateData(action.id, action.file).pipe(
        tap(() => this.notificationService.showMessage('messages.fileUpdated')),
        map((file => FilesEffects.fileUpdateSuccess(file, action.id))),
        catchError(error => this.error(error, filesActions.fileUpdateError()))
      )))
    ));
  }

  private createReplaceEffect(): void {
    this.replace = createEffect(() => this.actions.pipe(
      ofType(filesActions.fileReplace),
      switchMap(((action) => this.service.updateFile(action.id, action.file).pipe(
        tap(() => this.notificationService.showMessage('messages.fileUpdated')),
        map((file => FilesEffects.fileUpdateSuccess(file, action.id))),
        catchError(error => this.error(error, filesActions.fileUpdateError()))
      )))
    ));
  }

  private createUndoFromDashboardEffect(): void {
    this.undoFromDashboard = createEffect(() => this.actions.pipe(
      ofType(filesActions.fileUndoFromDashboard),
      switchMap(((action) => this.service.undoFromDashboard(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.undoFromDashboard')),
        map((file => FilesEffects.fileUpdateSuccess(file, action.id))),
        catchError(error => this.error(error, filesActions.fileUpdateError()))
      )))
    ));
  }
}
