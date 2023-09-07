import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Task} from '../../../../core/models/task';
import {StatusSheetComponent} from '../status-sheet/status-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Store} from '@ngrx/store';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {Observable, Subscription} from 'rxjs';
import {TaskStatus} from '../../../../core/models/task-status';
import {taskChangeStatus, taskDelete, tasksSingleAlarmUpdate} from '../../../../core/store/tasks/actions';
import {TaskSheetComponent} from '../../../tasks-alarms-shared/components/task-sheet/task-sheet.component';
import {selectTask} from '../../../../core/store/tasks/selectors';
import {AlarmSheetComponent} from '../alarm-sheet/alarm-sheet.component';
import {selectAlarm} from '../../../../core/store/alarms/selectors';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {filter, map} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
import {b1, b3} from '../../../../config/sizes.config';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {Alarm} from '../../../../core/models/alarm';
import {ConditionSheetComponent} from '../condition-sheet/condition-sheet.component';

@Component({
  selector: 'tasks-subtask',
  templateUrl: './subtask.component.html',
  styleUrls: ['./subtask.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubtaskComponent implements OnInit, OnDestroy {

  @Input() public task: Task;
  public status: TaskStatus;
  public small$: Observable<boolean>;
  public smallButtons$: Observable<boolean>;
  private sheet: MatBottomSheet;
  private alarmsStore: Store<AlarmsState>;
  private tasksStore: Store<TasksState>;
  private taskStatusContainer: TaskStatusContainer;
  private mainTask: Task;
  private breakpointObserver: BreakpointObserver;
  private subscriptions: Subscription[];
  private alarm: Alarm | null;

  public constructor(
    breakpointObserver: BreakpointObserver,
    sheet: MatBottomSheet, alarmsStore: Store<AlarmsState>,
    tasksStore: Store<TasksState>,
    taskStatusContainer: TaskStatusContainer
  ) {
    this.breakpointObserver = breakpointObserver;
    this.sheet = sheet;
    this.alarmsStore = alarmsStore;
    this.tasksStore = tasksStore;
    this.taskStatusContainer = taskStatusContainer;
  }

  public ngOnInit(): void {
    this.small$ = this.breakpointObserver.observe(b1).pipe(map(data => data.matches));
    this.smallButtons$ = this.breakpointObserver.observe(b3).pipe(map(data => data.matches));
    this.status = this.taskStatusContainer.getStatus(this.task.status);
    this.subscriptions = [
      this.tasksStore.select(selectTask(this.task.parentId))
        .subscribe(task => this.mainTask = task)
    ];
    if (this.task.alarm !== null) {
      this.subscriptions.push(
        this.alarmsStore.select(selectAlarm(this.task.alarm)).subscribe(alarm => this.alarm = alarm)
      );
    }
  }

  public openStatusSheet(): void {
    const sheetRef = this.sheet.open(StatusSheetComponent, {
      data: {without: this.task.status, doneDisabled: false, subtasksCount: 0}
    });
    sheetRef.afterDismissed()
      .pipe(filter(status => status !== undefined))
      .subscribe(status =>
        this.tasksStore.dispatch(taskChangeStatus({
          id: this.task.id,
          status: status
        })));
  }

  public deleteTask(): void {
    if (this.task.alarm === null) {
      const sheetRef = this.sheet.open(DeleteSheetComponent);
      sheetRef.afterDismissed()
        .pipe(filter(action => action))
        .subscribe(() => this.tasksStore.dispatch(taskDelete({id: this.task.id, deleteTasks: false, deleteAlarm: false})));
    } else {
      const sheetRef = this.sheet.open(ConditionSheetComponent, {data: {question: 'form.questions.deleteConnectedAlarm'}});
      sheetRef.afterDismissed()
        .pipe(filter(action => action !== undefined && action !== null))
        .subscribe(action => this.tasksStore.dispatch(taskDelete({id: this.task.id, deleteTasks: false, deleteAlarm: action})));
    }

  }

  public changeMain(): void {
    this.sheet.open(TaskSheetComponent, {
      data: {without: this.task.id, selected: this.mainTask}
    });
  }

  public openAlarmSheet(): void {
    const sheet = this.sheet.open(AlarmSheetComponent, {
      data: {selected: this.alarm}
    });
    sheet.afterDismissed()
      .pipe(filter(alarm => alarm !== undefined))
      .subscribe(alarm => this.tasksStore.dispatch(tasksSingleAlarmUpdate({
        id: this.task.id,
        alarm: alarm
      })));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
