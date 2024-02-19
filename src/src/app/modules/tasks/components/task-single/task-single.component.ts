import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Task} from '../../../../core/models/task';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {StatusSheetComponent} from '../status-sheet/status-sheet.component';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {TaskStatus} from '../../../../core/models/task-status';
import {Store} from '@ngrx/store';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {State as StatusesState} from '../../../../core/store/tasks-statuses/reducers';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {filter, first, map} from 'rxjs/operators';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Length} from '../../../../config/form.config';
import {selectSubtasks, selectTask, selectUndoneOrNotRejectedSubtasks} from '../../../../core/store/tasks/selectors';
import {
  taskChangeStatus,
  taskDelete,
  tasksSingleAlarmUpdate,
  tasksSingleContentUpdate,
  tasksSingleDateUpdate,
  tasksSingleNameUpdate
} from '../../../../core/store/tasks/actions';
import {TaskSheetComponent} from '../../../tasks-alarms-shared/components/task-sheet/task-sheet.component';
import {AlarmSheetComponent} from '../alarm-sheet/alarm-sheet.component';
import {selectAlarm} from '../../../../core/store/alarms/selectors';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {TaskPinnedService} from '../../../../core/services/task-pinned/task-pinned.service';
import {DateRequest} from '../../../../core/requests/tasks.request';
import * as moment from 'moment';
import {b1, b3} from '../../../../config/sizes.config';
import {Alarm} from '../../../../core/models/alarm';
import {DeleteWithConnectedSheetComponent} from '../delete-with-connected-sheet/delete-with-connected-sheet.component';
import {ConditionSheetComponent} from '../condition-sheet/condition-sheet.component';

@Component({
  selector: 'tasks-task-single',
  templateUrl: './task-single.component.html',
  styleUrls: ['./task-single.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskSingleComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public task: Task;
  public step: number;
  public status: TaskStatus;
  public subtasks$: Observable<Task[]>;
  public filteredSubtasks$: Observable<Task[]>;
  public progress$: Observable<number>;
  public hideDone: boolean;
  public small$: Observable<boolean>;
  public smallButtons$: Observable<boolean>;
  public maxNameLength: number;
  @Input() public previewAvailable: boolean = true;
  public doneTasks$: Observable<Task[]>;
  public alarm$: BehaviorSubject<Alarm | null>;
  public mainTask$: BehaviorSubject<Task | null>;
  private sheet: MatBottomSheet;
  private alarmsStore: Store<AlarmsState>;
  private tasksStore: Store<TasksState>;
  private statusesStore: Store<StatusesState>;
  private notificationService: NotificationService;
  private breakpointObserver: BreakpointObserver;
  private taskStatusContainer: TaskStatusContainer;
  private taskPinnedService: TaskPinnedService;
  private subscriptions: Subscription[];
  private doneStatusAvailable: boolean;

  public constructor(
    taskPinnedService: TaskPinnedService,
    settingsStore: Store<SettingsState>,
    taskStatusContainer: TaskStatusContainer,
    sheet: MatBottomSheet,
    alarmsStore: Store<AlarmsState>,
    tasksStore: Store<TasksState>,
    statusesStore: Store<StatusesState>,
    notificationService: NotificationService,
    breakpointObserver: BreakpointObserver
  ) {
    this.taskPinnedService = taskPinnedService;
    this.subscriptions = [];
    this.taskStatusContainer = taskStatusContainer;
    this.sheet = sheet;
    this.alarmsStore = alarmsStore;
    this.tasksStore = tasksStore;
    this.statusesStore = statusesStore;
    this.notificationService = notificationService;
    this.breakpointObserver = breakpointObserver;
    this.maxNameLength = Length.maxTaskNameLength;
    this.mainTask$ = new BehaviorSubject<Task | null>(null);
    this.alarm$ = new BehaviorSubject<Alarm | null>(null);
  }

  public ngOnInit(): void {
    this.small$ = this.breakpointObserver.observe(b1).pipe(map(data => data.matches));
    this.smallButtons$ = this.breakpointObserver.observe(b3).pipe(map(data => data.matches));
    this.step = -1;
    this.doneStatusAvailable = false;
    this.status = this.taskStatusContainer.getStatus(this.task.status);
    this.subtasks$ = this.tasksStore.select(selectSubtasks(this.task.id)).pipe(
      map(tasks => tasks.sort((a, b) => {
        let aDate = a.date === null ? moment(new Date(-8640000000000)) : moment(a.date);
        let bDate = b.date === null ? moment(new Date(-8640000000000)) : moment(b.date);
        if (aDate < bDate) {
          return 1;
        }
        if (aDate > bDate) {
          return -1;
        }
        return 0;
      }))
    );
    this.doneTasks$ = this.subtasks$.pipe(map(tasks => tasks
      .filter(task => task.status === this.taskStatusContainer.getDoneStatusId())));
    this.refreshTasks();
    this.progress$ = combineLatest([this.doneTasks$, this.subtasks$])
      .pipe(map(([done, subtasks]) => (done.length / subtasks.length) * 100));
    this.subscriptions.push(
      this.tasksStore.select(selectUndoneOrNotRejectedSubtasks(
        this.task.id,
        this.taskStatusContainer.getDoneStatusId(),
        this.taskStatusContainer.getRejectedStatusId()
      ))
        .pipe(map(tasks => tasks.length === 0))
        .subscribe(available => this.doneStatusAvailable = available)
    );
  }

  public changeSection(section: number): void {
    this.step = this.step === section ? -1 : section;
  }

  public deleteTask(): void {
    let subtasksCount = this.task.subtasks.length;
    let alarmAssigned = this.task.alarm !== null;
    if (subtasksCount === 0 && !alarmAssigned) {
      const sheetRef = this.sheet.open(DeleteSheetComponent);
      sheetRef.afterDismissed()
        .pipe(filter(action => action))
        .subscribe(() => this.tasksStore.dispatch(taskDelete({id: this.task.id, deleteTasks: false, deleteAlarm: false})));
    } else if (subtasksCount !== 0 && !alarmAssigned) {
      const sheetRef = this.sheet.open(ConditionSheetComponent, {data: {question: 'form.questions.deleteConnectedTasks'}});
      sheetRef.afterDismissed()
        .pipe(filter(action => action !== undefined && action !== null))
        .subscribe(action => this.tasksStore.dispatch(taskDelete({id: this.task.id, deleteTasks: action, deleteAlarm: false})));
    } else if (subtasksCount === 0 && alarmAssigned) {
      const sheetRef = this.sheet.open(ConditionSheetComponent, {data: {question: 'form.questions.deleteConnectedAlarm'}});
      sheetRef.afterDismissed()
        .pipe(filter(action => action !== undefined && action !== null))
        .subscribe(action => this.tasksStore.dispatch(taskDelete({id: this.task.id, deleteTasks: false, deleteAlarm: action})));
    } else {
      const sheetRef = this.sheet.open(DeleteWithConnectedSheetComponent, {data: {withTooltip: false}});
      sheetRef.afterDismissed()
        .pipe(filter(action => action !== undefined && action !== null))
        .subscribe(action => this.tasksStore.dispatch(taskDelete({
          id: this.task.id,
          deleteTasks: action.deleteTasks,
          deleteAlarm: action.deleteAlarm
        })));
    }
  }

  public openMainTaskSheet(): void {
    this.sheet.open(TaskSheetComponent, {
      data: {without: this.task.id, selected: this.mainTask$.getValue()}
    });
  }

  public openStatusSheet(): void {
    const sheetRef = this.sheet.open(StatusSheetComponent, {
      data: {without: this.task.status, doneDisabled: !this.doneStatusAvailable, subtasksCount: this.task.subtasks.length}
    });
    sheetRef.afterDismissed()
      .pipe(filter(status => status !== undefined))
      .subscribe(status => {
        this.tasksStore.dispatch(taskChangeStatus({
          id: this.task.id,
          status: status
        }));
      });
  }

  public saveName(name: string): void {
    this.tasksStore.dispatch(tasksSingleNameUpdate({id: this.task.id, name: name}));
  }

  public updateContent(content: string | null): void {
    this.tasksStore.dispatch(tasksSingleContentUpdate({id: this.task.id, content: content}));
  }

  public updateDate(date: Date | null): void {
    const request: DateRequest = {
      date: moment(date).format('YYYY-MM-DD')
    };
    this.tasksStore.dispatch(tasksSingleDateUpdate({id: this.task.id, date: request}));
  }

  public openAlarmSheet(): void {
    const sheet = this.sheet.open(AlarmSheetComponent, {
      data: {selected: this.alarm$.getValue()}
    });
    sheet.afterDismissed()
      .pipe(filter(alarm => alarm !== undefined))
      .subscribe(alarm => this.tasksStore.dispatch(tasksSingleAlarmUpdate({
        id: this.task.id,
        alarm: alarm
      })));
  }

  public getGroup(): Observable<Task> {
    return this.alarmsStore.select(selectTask(this.task.group));
  }

  public getParent(): Observable<Task> {
    return this.alarmsStore.select(selectTask(this.task.parentId));
  }

  public refreshTasks(): void {
    this.filteredSubtasks$ = this.subtasks$
      .pipe(map(tasks => !this.hideDone ? tasks : tasks.filter(task => task.status != this.taskStatusContainer.getDoneStatusId())));
  }

  public openPinnedSidenav(type: number): void {
    this.taskPinnedService.changeStatus({
      open: true,
      taskId: this.task.id,
      type: type
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.status = this.taskStatusContainer.getStatus(this.task.status);
    if (this.task.alarm !== null) {
      this.subscriptions.push(
        this.alarmsStore.select(selectAlarm(this.task.alarm)).pipe(first()).subscribe(alarm => this.alarm$.next(alarm))
      );
    } else {
      this.alarm$.next(null);
    }
    if (this.task.parentId !== null) {
      this.subscriptions.push(
        this.tasksStore.select(selectTask(this.task.parentId)).pipe(first()).subscribe(task => this.mainTask$.next(task))
      );
    } else {
      this.mainTask$.next(null);
    }
  }
}
