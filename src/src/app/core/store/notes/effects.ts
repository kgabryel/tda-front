import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as notesActions from './actions';
import {Update} from '@ngrx/entity';
import {NotificationService} from '../../services/notification/notification.service';
import {NotesService} from '../../services/notes/notes.service';
import {Note} from '../../models/note';
import {Store} from '@ngrx/store';
import {State} from './reducers';
import {EventsService} from '../../services/events/events.service';
import {EffectsWithReload} from '../EffectsWithReload';


@Injectable()
export class NotesEffects extends EffectsWithReload<NotesService, State> {

  load;
  reload;
  add;
  delete;
  update;
  undoFromDashboard;

  constructor(
    actions: Actions,
    service: NotesService,
    notificationService: NotificationService,
    store: Store<State>,
    eventsService: EventsService
  ) {
    super(store, eventsService, actions, notificationService, service);

  }

  private static noteUpdateSuccess(note: Note, id: number) {
    const update: Update<Note> = {id, changes: note};
    return notesActions.noteUpdateSuccess({note: update});
  }

  protected initEffects(): void {
    this.createLoadEffect();
    this.createReloadEffect();
    this.createAddEffect();
    this.createDeleteEffect();
    this.createUpdateEffect();
    this.createUndoFromDashboardEffect();
  }

  protected watchChanges(): void {
    this.eventsService.subscribeNotesChanges(data => {
      if (data.modifiedData.length > 0) {
        this.store.dispatch(notesActions.notesReload({selected: data.modifiedData}));
      }
    });
  }

  private createLoadEffect(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(notesActions.notesLoad),
      switchMap((() => this.service.getAll().pipe(
        map((notes => notesActions.notesLoadSuccess({notes}))),
        catchError(error => this.error(error, notesActions.notesLoadError()))
      )))
    ));
  }

  private createReloadEffect(): void {
    this.reload = createEffect(() => this.actions.pipe(
      ofType(notesActions.notesReload),
      switchMap(((action) => this.service.getSelected(action.selected).pipe(
        tap(notes => action.selected.filter(x => !notes.map(note => note.id).includes(x))
          .forEach(id => this.store.dispatch(notesActions.noteDeleteSuccess({id})))),
        map((notes => notesActions.notesReloadSuccess({notes}))),
        catchError(error => this.error(error, notesActions.notesReloadError()))
      )))
    ));
  }

  private createAddEffect(): void {
    this.add = createEffect(() =>
      this.actions.pipe(
        ofType(notesActions.noteAdd),
        switchMap(action => this.service.add(action.note).pipe(
          tap(() => this.notificationService.showMessage('messages.noteAdded')),
          map((note => notesActions.noteAddSuccess({note}))),
          catchError(error => this.error(error, notesActions.noteAddError()))
        ))
      ));
  }

  private createDeleteEffect(): void {
    this.delete = createEffect(() => this.actions.pipe(
      ofType(notesActions.noteDelete),
      switchMap(((action) => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.noteDeleted')),
        map((id => notesActions.noteDeleteSuccess({id}))),
        catchError(error => this.error(error, notesActions.noteDeleteError()))
      )))
    ));
  }

  private createUpdateEffect(): void {
    this.update = createEffect(() => this.actions.pipe(
      ofType(notesActions.noteUpdate),
      switchMap(((action) => this.service.update(action.id, action.note).pipe(
        tap(() => this.notificationService.showMessage('messages.noteUpdated')),
        map((note => NotesEffects.noteUpdateSuccess(note, action.id))),
        catchError(error => this.error(error, notesActions.noteUpdateError()))
      )))
    ));
  }

  private createUndoFromDashboardEffect(): void {
    this.undoFromDashboard = createEffect(() => this.actions.pipe(
      ofType(notesActions.noteUndoFromDashboard),
      switchMap(((action) => this.service.undoFromDashboard(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.undoFromDashboard')),
        map((note => NotesEffects.noteUpdateSuccess(note, action.id))),
        catchError(error => this.error(error, notesActions.noteUpdateError()))
      )))
    ));
  }
}
