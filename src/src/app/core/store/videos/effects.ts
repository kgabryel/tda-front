import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as videosActions from './actions';
import {VideosService} from '../../services/videos/videos.service';
import {NotificationService} from '../../services/notification/notification.service';
import {Update} from '@ngrx/entity';
import {Video} from '../../models/video';
import {Store} from '@ngrx/store';
import {State} from './reducers';
import {EventsService} from '../../services/events/events.service';
import {EffectsWithReload} from '../EffectsWithReload';


@Injectable()
export class VideosEffects extends EffectsWithReload<VideosService, State> {

  load;
  reload;
  add;
  delete;
  update;
  undoFromDashboard;

  constructor(
    actions: Actions,
    service: VideosService,
    notificationService: NotificationService,
    store: Store<State>,
    eventsService: EventsService
  ) {
    super(store, eventsService, actions, notificationService, service);
  }

  private static videoUpdateSuccess(video: Video, id: number) {
    const update: Update<Video> = {id, changes: video};
    return videosActions.videoUpdateSuccess({video: update});
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
    this.eventsService.subscribeVideosChanges(data => {
      if (data.modifiedData.length > 0) {
        this.store.dispatch(videosActions.videosReload({selected: data.modifiedData}));
      }
    });
  }

  private createLoadEffect(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(videosActions.videosLoad),
      switchMap((() => this.service.getAll().pipe(
        map(videos => videosActions.videosLoadSuccess({videos})),
        catchError(error => this.error(error, videosActions.videosLoadError()))
      )))
    ));
  }

  private createReloadEffect(): void {
    this.reload = createEffect(() => this.actions.pipe(
      ofType(videosActions.videosReload),
      switchMap(((action) => this.service.getSelected(action.selected).pipe(
        tap(videos => action.selected.filter(x => !videos.map(video => video.id).includes(x))
          .forEach(id => this.store.dispatch(videosActions.videoDeleteSuccess({id})))),
        map((videos => videosActions.videosReloadSuccess({videos}))),
        catchError(error => this.error(error, videosActions.videosReloadError()))
      )))
    ));
  }

  private createAddEffect(): void {
    this.add = createEffect(() =>
      this.actions.pipe(
        ofType(videosActions.videoAdd),
        switchMap(action => this.service.add(action.video).pipe(
          tap(videos => this.notificationService.showMessage(videos.length === 1 ? 'messages.videoAdded' : 'messages.videosAdded')),
          map((videos => videosActions.videoAddSuccess({videos}))),
          catchError(error => this.error(error, videosActions.videoAddError()))
        ))
      ));
  }

  private createDeleteEffect(): void {
    this.delete = createEffect(() => this.actions.pipe(
      ofType(videosActions.videoDelete),
      switchMap(((action) => this.service.delete(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.videoDeleted')),
        map((id => videosActions.videoDeleteSuccess({id}))),
        catchError(error => this.error(error, videosActions.videoDeleteError()))
      )))
    ));
  }

  private createUpdateEffect(): void {
    this.update = createEffect(() => this.actions.pipe(
      ofType(videosActions.videoUpdate),
      switchMap(((action) => this.service.update(action.id, action.request).pipe(
        tap(() => this.notificationService.showMessage('messages.videoUpdated')),
        map((video => VideosEffects.videoUpdateSuccess(video, action.id))),
        catchError(error => this.error(error, videosActions.videoUpdateError()))
      )))
    ));
  }

  private createUndoFromDashboardEffect(): void {
    this.undoFromDashboard = createEffect(() => this.actions.pipe(
      ofType(videosActions.videoUndoFromDashboard),
      switchMap(((action) => this.service.undoFromDashboard(action.id).pipe(
        tap(() => this.notificationService.showMessage('messages.undoFromDashboard')),
        map((video => VideosEffects.videoUpdateSuccess(video, action.id))),
        catchError(error => this.error(error, videosActions.videoUpdateError()))
      )))
    ));
  }
}
