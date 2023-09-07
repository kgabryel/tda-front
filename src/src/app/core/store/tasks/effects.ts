import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import * as tasksActions from './actions';
import {TasksService} from '../../services/tasks/tasks.service';
import {NotificationService} from '../../services/notification/notification.service';
import {Update} from '@ngrx/entity';
import {Task} from '../../models/task';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {State} from './reducers';
import {EventsService} from '../../services/events/events.service';
import {PathUtils} from '../../utils/path.utils';
import {RoutingConfig} from '../../../config/routing.config';
import {EffectsWithReload} from '../EffectsWithReload';


@Injectable()
export class TasksEffects extends EffectsWithReload<TasksService, State> {

  load;
  reload;
  addSingle;
  addPeriodic;
  changeTaskStatus;
  delete;
  modifySingleName;
  modifyPeriodicName;
  modifySingleContent;
  modifyPeriodicContent;
  modifyDate;
  modifyMainTask;
  modifyAlarm;
  removeCatalog;
  removeNote;
  removeBookmark;
  removeFile;
  removeVideo;
  addCatalog;
  addNote;
  addBookmark;
  addFile;
  addVideo;
  activateTaskPeriodic;
  deactivateTaskPeriodic;
  private router: Router;

  constructor(
    actions: Actions,
    service: TasksService,
    notificationService: NotificationService,
    router: Router,
    store: Store<State>,
    eventsService: EventsService
  ) {
    super(store, eventsService, actions, notificationService, service);
    this.router = router;
  }

  private static taskUpdateSuccess(task: Task, id: string) {
    const update: Update<Task> = {id, changes: task};
    return tasksActions.tasksUpdateSuccess({task: update});
  }

  protected initEffects(): void {
    this.createLoadTasks();
    this.createReloadEffect();
    this.createAddSingleTask();
    this.createAddPeriodicTask();
    this.addChangeTaskStatus();
    this.createDelete();
    this.createModifySingleNameEffect();
    this.createModifyPeriodicNameEffect();
    this.createModifySingleContentEffect();
    this.createModifyPeriodicContentEffect();
    this.createModifyDateEffect();
    this.createModifyMainTaskEffect();
    this.createModifyAlarmEffect();
    this.createRemoveCatalogEffect();
    this.createRemoveNoteEffect();
    this.createRemoveBookmarkEffect();
    this.createRemoveFileEffect();
    this.createRemoveVideoEffect();
    this.createAddCatalogEffect();
    this.createAddNoteEffect();
    this.createAddBookmarkEffect();
    this.createAddFileEffect();
    this.createAddVideoEffect();
    this.createActivatePeriodicTask();
    this.createDeactivatePeriodicAlarm();
  }

  protected watchChanges(): void {
    this.eventsService.subscribeTasksChanges(data => {
      if (data.modifiedData.length > 0) {
        this.store.dispatch(tasksActions.tasksReload({selected: data.modifiedData}));
      }
    });
  }

  private addChangeTaskStatus(): void {
    this.changeTaskStatus = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.taskChangeStatus),
        switchMap(action => this.service.changeStatus(action.id, action.status).pipe(
          tap(() => this.notificationService.showMessage('messages.statusUpdated')),
          map((task => TasksEffects.taskUpdateSuccess(task, task.id))),
          catchError(error => this.error(error, tasksActions.taskChangeStatusError()))
        ))
      ));
  }

  private createLoadTasks(): void {
    this.load = createEffect(() => this.actions.pipe(
      ofType(tasksActions.tasksLoad),
      switchMap((() => this.service.getAll().pipe(
        map(tasks => tasksActions.taskLoadSuccess({tasks})),
        catchError(error => this.error(error, tasksActions.taskLoadError()))
      )))
    ));
  }

  private createReloadEffect(): void {
    this.reload = createEffect(() => this.actions.pipe(
      ofType(tasksActions.tasksReload),
      switchMap(((action) => this.service.getSelected(action.selected).pipe(
        tap(tasks => action.selected.filter(x => !tasks.map(task => task.id).includes(x))
          .forEach(id => this.store.dispatch(tasksActions.taskDeleteSuccess({id})))),
        map((tasks => tasksActions.tasksReloadSuccess({tasks}))),
        catchError(error => this.error(error, tasksActions.tasksReloadError()))
      )))
    ));
  }

  private createAddSingleTask(): void {
    this.addSingle = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.tasksSingleAdd),
        switchMap(action => this.service.createSingle(action.task).pipe(
          tap((task) => {
            this.notificationService.showMessage('messages.taskAdded');
            if (action.redirect) {
              this.router.navigate([PathUtils.concatPath(RoutingConfig.tasks, task.id)]);
            }
          }),
          map((task => tasksActions.tasksAddSuccess({task}))),
          catchError(error => this.error(error, tasksActions.tasksAddError()))
        ))
      ));
  }

  private createAddPeriodicTask(): void {
    this.addPeriodic = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.tasksPeriodicAdd),
        switchMap(action => this.service.createPeriodic(action.task).pipe(
          tap((task) => {
            this.notificationService.showMessage('messages.taskAdded');
            if (action.redirect) {
              this.router.navigate([PathUtils.concatPath(RoutingConfig.tasks, task.id)]);
            }
          }),
          map((task => tasksActions.tasksAddSuccess({task}))),
          catchError(error => this.error(error, tasksActions.tasksAddError()))
        ))
      ));
  }

  private createDelete(): void {
    this.delete = createEffect(() => this.actions.pipe(
      ofType(tasksActions.taskDelete),
      switchMap(((action) => this.service.deleteTask(action.id, action.deleteTasks, action.deleteAlarm).pipe(
        tap(() => this.notificationService.showMessage('messages.taskDeleted')),
        map((id => tasksActions.taskDeleteSuccess({id}))),
        catchError(error => this.error(error, tasksActions.taskDeleteError()))
      )))
    ));
  }

  private createModifySingleNameEffect(): void {
    this.modifySingleName = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.tasksSingleNameUpdate),
        switchMap(action => this.service.updateName(action.id, action.name, false).pipe(
          tap(() => this.notificationService.showMessage('messages.taskUpdated')),
          map((task => TasksEffects.taskUpdateSuccess(task, action.id))),
          catchError(error => this.error(error, tasksActions.tasksUpdateError()))
        ))
      ));
  }

  private createModifyPeriodicNameEffect(): void {
    this.modifyPeriodicName = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.tasksPeriodicNameUpdate),
        switchMap(action => this.service.updateName(action.id, action.name, true).pipe(
          tap(() => this.notificationService.showMessage('messages.taskUpdated')),
          map((task => TasksEffects.taskUpdateSuccess(task, action.id))),
          catchError(error => this.error(error, tasksActions.tasksUpdateError()))
        ))
      ));
  }

  private createModifySingleContentEffect(): void {
    this.modifySingleContent = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.tasksSingleContentUpdate),
        switchMap(action => this.service.updateContent(action.id, action.content, false).pipe(
          tap(() => this.notificationService.showMessage('messages.taskUpdated')),
          map((task => TasksEffects.taskUpdateSuccess(task, action.id))),
          catchError(error => this.error(error, tasksActions.tasksUpdateError()))
        ))
      )
    );
  }

  private createModifyPeriodicContentEffect(): void {
    this.modifyPeriodicContent = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.tasksPeriodicContentUpdate),
        switchMap(action => this.service.updateContent(action.id, action.content, true).pipe(
          tap(() => this.notificationService.showMessage('messages.taskUpdated')),
          map((task => TasksEffects.taskUpdateSuccess(task, action.id))),
          catchError(error => this.error(error, tasksActions.tasksUpdateError()))
        ))
      )
    );
  }

  private createModifyDateEffect(): void {
    this.modifyDate = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.tasksSingleDateUpdate),
        switchMap(action => this.service.updateDate(action.id, action.date).pipe(
          tap(() => this.notificationService.showMessage('messages.taskUpdated')),
          map((task => TasksEffects.taskUpdateSuccess(task, action.id))),
          catchError(error => this.error(error, tasksActions.tasksUpdateError()))
        ))
      )
    );
  }

  private createModifyMainTaskEffect(): void {
    this.modifyMainTask = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.tasksSingleMainTaskUpdate),
        switchMap(action => this.service.updateMainTask(action.id, action.mainTask).pipe(
          tap(() => this.notificationService.showMessage('messages.taskUpdated')),
          map((task => TasksEffects.taskUpdateSuccess(task, action.id))),
          catchError(error => this.error(error, tasksActions.tasksUpdateError()))
        ))
      )
    );
  }

  private createModifyAlarmEffect(): void {
    this.modifyAlarm = createEffect(() =>
      this.actions.pipe(
        ofType(tasksActions.tasksSingleAlarmUpdate),
        switchMap(action => this.service.updateAlarm(action.id, action.alarm).pipe(
          tap(() => this.notificationService.showMessage('messages.taskUpdated')),
          map((task => TasksEffects.taskUpdateSuccess(task, action.id))),
          catchError(error => this.error(error, tasksActions.tasksUpdateError()))
        ))
      )
    );
  }

  private createRemoveCatalogEffect(): void {
    this.removeCatalog = createEffect(() => this.actions.pipe(
      ofType(tasksActions.catalogRemove),
      switchMap(((action) => this.service.undo(action.taskId, action.catalogId, 'catalogs').pipe(
        tap(() => this.notificationService.showMessage('messages.catalogRemoved')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createRemoveNoteEffect(): void {
    this.removeNote = createEffect(() => this.actions.pipe(
      ofType(tasksActions.noteRemove),
      switchMap(((action) => this.service.undo(action.taskId, action.noteId, 'notes').pipe(
        tap(() => this.notificationService.showMessage('messages.noteRemoved')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createRemoveBookmarkEffect(): void {
    this.removeBookmark = createEffect(() => this.actions.pipe(
      ofType(tasksActions.bookmarkRemove),
      switchMap(((action) => this.service.undo(action.taskId, action.bookmarkId, 'bookmarks').pipe(
        tap(() => this.notificationService.showMessage('messages.bookmarkRemoved')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createRemoveFileEffect(): void {
    this.removeFile = createEffect(() => this.actions.pipe(
      ofType(tasksActions.fileRemove),
      switchMap(((action) => this.service.undo(action.taskId, action.fileId, 'files').pipe(
        tap(() => this.notificationService.showMessage('messages.fileRemoved')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createRemoveVideoEffect(): void {
    this.removeVideo = createEffect(() => this.actions.pipe(
      ofType(tasksActions.videoRemove),
      switchMap(((action) => this.service.undo(action.taskId, action.videoId, 'videos').pipe(
        tap(() => this.notificationService.showMessage('messages.videoRemoved')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createAddCatalogEffect(): void {
    this.addCatalog = createEffect(() => this.actions.pipe(
      ofType(tasksActions.catalogAdd),
      switchMap(((action) => this.service.addPinned(action.taskId, action.catalogId, 'catalogs').pipe(
        tap(() => this.notificationService.showMessage('alarms.catalogAdded')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createAddNoteEffect(): void {
    this.addNote = createEffect(() => this.actions.pipe(
      ofType(tasksActions.noteAdd),
      switchMap(((action) => this.service.addPinned(action.taskId, action.noteId, 'notes').pipe(
        tap(() => this.notificationService.showMessage('alarms.noteAdded')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createAddBookmarkEffect(): void {
    this.addBookmark = createEffect(() => this.actions.pipe(
      ofType(tasksActions.bookmarkAdd),
      switchMap(((action) => this.service.addPinned(action.taskId, action.bookmarkId, 'bookmarks').pipe(
        tap(() => this.notificationService.showMessage('alarms.bookmarkAdded')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createAddFileEffect(): void {
    this.addFile = createEffect(() => this.actions.pipe(
      ofType(tasksActions.fileAdd),
      switchMap(((action) => this.service.addPinned(action.taskId, action.fileId, 'files').pipe(
        tap(() => this.notificationService.showMessage('alarms.fileAdded')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createAddVideoEffect(): void {
    this.addVideo = createEffect(() => this.actions.pipe(
      ofType(tasksActions.videoAdd),
      switchMap(((action) => this.service.addPinned(action.taskId, action.videoId, 'videos').pipe(
        tap(() => this.notificationService.showMessage('alarms.videoAdded')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.taskId))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createActivatePeriodicTask(): void {
    this.activateTaskPeriodic = createEffect(() => this.actions.pipe(
      ofType(tasksActions.taskPeriodicActivate),
      switchMap(((action) => this.service.activatePeriodicTask(action.id, action.action).pipe(
        tap(() => this.notificationService.showMessage('messages.taskUpdated')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.id))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }

  private createDeactivatePeriodicAlarm(): void {
    this.deactivateTaskPeriodic = createEffect(() => this.actions.pipe(
      ofType(tasksActions.taskPeriodicDeactivate),
      switchMap(((action) => this.service.deactivatePeriodicTask(action.id, action.action).pipe(
        tap(() => this.notificationService.showMessage('messages.taskUpdated')),
        map((task => TasksEffects.taskUpdateSuccess(task, action.id))),
        catchError(error => this.error(error, tasksActions.tasksUpdateError()))
      )))
    ));
  }
}
