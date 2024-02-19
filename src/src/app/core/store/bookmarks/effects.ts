import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as bookmarksActions from './actions';
import {Update} from '@ngrx/entity';
import {BookmarksService} from '../../services/bookmarks/bookmarks.service';
import {NotificationService} from '../../services/notification/notification.service';
import {Bookmark} from '../../models/bookmark';
import {Store} from '@ngrx/store';
import {State} from './reducers';
import {EventsService} from '../../services/events/events.service';
import {EffectsWithReload} from '../EffectsWithReload';

@Injectable()
export class BookmarksEffects extends EffectsWithReload<BookmarksService, State> {

  load;
  reload;
  add;
  delete;
  update;
  undoFromDashboard;

  constructor(
    actions: Actions,
    service: BookmarksService,
    notificationService: NotificationService,
    store: Store<State>,
    eventsService: EventsService
  ) {
    super(store, eventsService, actions, notificationService, service);
  }

  private static bookmarkUpdateSuccess(bookmark: Bookmark, id: number) {
    const update: Update<Bookmark> = {id, changes: bookmark};
    return bookmarksActions.bookmarkUpdateSuccess({bookmark: update});
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
    this.eventsService.subscribeBookmarksChanges(data => {
      if (data.modifiedData.length > 0) {
        this.store.dispatch(bookmarksActions.bookmarksReload({selected: data.modifiedData}));
      }
    });
  }

  private createLoadEffect(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(bookmarksActions.bookmarksLoad),
      switchMap((() => this.service.getAll().pipe(
        map((bookmarks => bookmarksActions.bookmarksLoadSuccess({bookmarks}))),
        catchError(error => this.error(error, bookmarksActions.bookmarksLoadError()))
      )))
    ));
  }

  private createReloadEffect(): void {
    this.reload = createEffect(() => this.actions.pipe(
      ofType(bookmarksActions.bookmarksReload),
      switchMap(((action) => this.service.getSelected(action.selected).pipe(
        tap(bookmarks => action.selected.filter(x => !bookmarks.map(bookmark => bookmark.id).includes(x))
          .forEach(id => this.store.dispatch(bookmarksActions.bookmarkDeleteSuccess({id})))),
        map((bookmarks => bookmarksActions.bookmarksReloadSuccess({bookmarks}))),
        catchError(error => this.error(error, bookmarksActions.bookmarksReloadError()))
      )))
    ));
  }

  private createAddEffect(): void {
    this.add = createEffect(() =>
      this.actions.pipe(
        ofType(bookmarksActions.bookmarkAdd),
        switchMap(action => this.service.add(action.bookmark).pipe(
          tap(() => this.notificationService.showMessage('messages.bookmarkAdded')),
          map((bookmark => bookmarksActions.bookmarkAddSuccess({bookmark}))),
          catchError(error => this.error(error, bookmarksActions.bookmarkAddError()))
        ))
      ));
  }

  private createDeleteEffect(): void {
    this.delete = createEffect(() => this.actions.pipe(
      ofType(bookmarksActions.bookmarkDelete),
      switchMap(((action) => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.bookmarkDeleted')),
        map((id => bookmarksActions.bookmarkDeleteSuccess({id}))),
        catchError(error => this.error(error, bookmarksActions.bookmarkDeleteError()))
      )))
    ));
  }

  private createUpdateEffect(): void {
    this.update = createEffect(() => this.actions.pipe(
      ofType(bookmarksActions.bookmarkUpdate),
      switchMap(((action) => this.service.update(action.id, action.bookmark).pipe(
        tap(() => this.notificationService.showMessage('messages.bookmarkUpdated')),
        map((bookmark => BookmarksEffects.bookmarkUpdateSuccess(bookmark, action.id))),
        catchError(error => this.error(error, bookmarksActions.bookmarkUpdateError()))
      )))
    ));
  }

  private createUndoFromDashboardEffect(): void {
    this.undoFromDashboard = createEffect(() => this.actions.pipe(
      ofType(bookmarksActions.bookmarkUndoFromDashboard),
      switchMap(((action) => this.service.undoFromDashboard(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.undoFromDashboard')),
        map((bookmark => BookmarksEffects.bookmarkUpdateSuccess(bookmark, action.id))),
        catchError(error => this.error(error, bookmarksActions.bookmarkUpdateError()))
      )))
    ));
  }
}
