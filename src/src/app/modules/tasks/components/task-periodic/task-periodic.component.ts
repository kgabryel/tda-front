import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Task, TaskSearch} from '../../../../core/models/task';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Store} from '@ngrx/store';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {
  taskDelete,
  taskPeriodicActivate,
  taskPeriodicDeactivate,
  tasksPeriodicContentUpdate,
  tasksPeriodicNameUpdate
} from '../../../../core/store/tasks/actions';
import {Length} from '../../../../config/form.config';
import {Observable, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
import {selectTasksForGroup} from '../../../../core/store/tasks/selectors';
import {selectSettings} from '../../../../core/store/settings/selectors';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {TaskPinnedService} from '../../../../core/services/task-pinned/task-pinned.service';
import {b1} from '../../../../config/sizes.config';
import {
  ActivatePeriodicTaskSheetComponent
} from '../activate-periodic-task-sheet/activate-periodic-task-sheet.component';
import {
  DeactivatePeriodicTaskSheetComponent
} from '../deactivate-periodic-task-sheet/deactivate-periodic-task-sheet.component';
import * as moment from 'moment/moment';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {DeleteWithConnectedSheetComponent} from '../delete-with-connected-sheet/delete-with-connected-sheet.component';
import {ConditionSheetComponent} from '../condition-sheet/condition-sheet.component';

@Component({
  selector: 'tasks-task-periodic',
  templateUrl: './task-periodic.component.html',
  styleUrls: ['./task-periodic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskPeriodicComponent implements OnInit, OnDestroy {

  @Input() public task: Task;
  public step: number;
  public maxNameLength: number;
  @Input() public previewAvailable: boolean = true;
  public small$: Observable<boolean>;
  public tasks$: Observable<Task[]>;
  public hideDone: boolean;
  private statusSheet: MatBottomSheet;
  private tasksStore: Store<TasksState>;
  private alarmsStore: Store<AlarmsState>;
  private sheet: MatBottomSheet;
  private breakpointObserver: BreakpointObserver;
  private taskStatusContainer: TaskStatusContainer;
  private taskPinnedService: TaskPinnedService;
  private subscriptions: Subscription[];
  private settingsStore: Store<SettingsState>;

  public constructor(
    taskPinnedService: TaskPinnedService,
    settingsStore: Store<SettingsState>,
    taskStatusContainer: TaskStatusContainer,
    statusSheet: MatBottomSheet,
    tasksStore: Store<TasksState>,
    alarmsStore: Store<AlarmsState>,
    sheet: MatBottomSheet,
    breakpointObserver: BreakpointObserver
  ) {
    this.taskPinnedService = taskPinnedService;
    this.taskStatusContainer = taskStatusContainer;
    this.statusSheet = statusSheet;
    this.tasksStore = tasksStore;
    this.alarmsStore = alarmsStore;
    this.breakpointObserver = breakpointObserver;
    this.sheet = sheet;
    this.maxNameLength = Length.maxTaskNameLength;
    this.settingsStore = settingsStore;
  }

  public ngOnInit(): void {
    this.step = -1;
    this.subscriptions = [
      this.settingsStore.select(selectSettings('hideDoneTasksInTasksGroups')).subscribe(value => {
        this.hideDone = value;
        this.refreshTasks(this.getEmptySearch());
      })
    ];
    this.refreshTasks(this.getEmptySearch());
    this.small$ = this.breakpointObserver.observe(b1).pipe(map(data => data.matches));
  }

  public deleteTask(): void {
    let tasksCount = this.task.tasks.length;
    let alarmAssigned = this.task.alarm !== null;
    if (tasksCount === 0 && !alarmAssigned) {
      const sheetRef = this.sheet.open(DeleteSheetComponent);
      sheetRef.afterDismissed()
        .pipe(filter(action => action))
        .subscribe(() => this.tasksStore.dispatch(taskDelete({id: this.task.id, deleteTasks: false, deleteAlarm: false})));
    } else if (tasksCount !== 0 && !alarmAssigned) {
      const sheetRef = this.sheet.open(ConditionSheetComponent, {data: {question: 'form.questions.deleteConnectedTasks'}});
      sheetRef.afterDismissed()
        .pipe(filter(action => action !== undefined && action !== null))
        .subscribe(action => this.tasksStore.dispatch(taskDelete({id: this.task.id, deleteTasks: action, deleteAlarm: false})));
    } else if (tasksCount === 0 && alarmAssigned) {
      const sheetRef = this.sheet.open(ConditionSheetComponent, {data: {question: 'form.questions.deleteConnectedAlarm'}});
      sheetRef.afterDismissed()
        .pipe(filter(action => action !== undefined && action !== null))
        .subscribe(action => this.tasksStore.dispatch(taskDelete({id: this.task.id, deleteTasks: false, deleteAlarm: action})));
    } else {
      const sheetRef = this.sheet.open(DeleteWithConnectedSheetComponent, {data: {withTooltip: true}});
      sheetRef.afterDismissed()
        .pipe(filter(action => action !== undefined && action !== null))
        .subscribe(action => this.tasksStore.dispatch(taskDelete({
          id: this.task.id,
          deleteTasks: action.deleteTasks,
          deleteAlarm: action.deleteAlarm
        })));
    }
  }

  public changeSection(section: number): void {
    this.step = this.step === section ? -1 : section;
  }

  public saveName(name: string): void {
    this.tasksStore.dispatch(tasksPeriodicNameUpdate({id: this.task.id, name}));
  }

  public updateContent(content: string | null): void {
    this.tasksStore.dispatch(tasksPeriodicContentUpdate({id: this.task.id, content}));
  }

  public refreshTasks(search: TaskSearch): void {
    this.tasks$ = this.tasksStore.select(selectTasksForGroup(this.task.id, search))
      .pipe(
        map(tasks => tasks.sort((a, b) => {
          let aDate = moment(a.date);
          let bDate = moment(b.date);
          if (aDate < bDate) {
            return -1;
          }
          if (aDate > bDate) {
            return 1;
          }
          return 0;
        })),
        map(tasks => !this.hideDone ? tasks : tasks.filter(task => task.status != this.taskStatusContainer.getDoneStatusId()))
      );
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

  public activate(): void {

    const sheet = this.sheet.open(
      ActivatePeriodicTaskSheetComponent,
      {data: {tasks$: this.getFutureTasks()}}
    );
    sheet.afterDismissed().pipe(filter(action => action !== null && action !== undefined))
      .subscribe(action => this.tasksStore.dispatch(taskPeriodicActivate({
        id: this.task.id,
        action: action
      })));
  }

  public deactivate(): void {
    const sheet = this.sheet.open(DeactivatePeriodicTaskSheetComponent, {
      data: {tasks$: this.getFutureTasks()}
    });
    sheet.afterDismissed().pipe(filter(action => action !== null && action !== undefined))
      .subscribe(action => {
        this.tasksStore.dispatch(taskPeriodicDeactivate({
          id: this.task.id,
          action: action
        }));
      });
  }

  public getEmptySearch(): TaskSearch {
    return {
      statuses: [],
      start: null,
      stop: null
    };
  }

  private getFutureTasks(): Observable<Task[]> {
    return this.tasksStore.select(selectTasksForGroup(this.task.id, {
      statuses: [],
      start: new Date(),
      stop: null
    }));
  }
}
