import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StatusSheetComponent} from '../../../tasks/components/status-sheet/status-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Store} from '@ngrx/store';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {Task} from '../../../../core/models/task';
import {filter, map} from 'rxjs/operators';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {selectUndoneOrNotRejectedSubtasks} from '../../../../core/store/tasks/selectors';
import {taskChangeStatus} from '../../../../core/store/tasks/actions';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {TaskStatus} from '../../../../core/models/task-status';
import {Subscription} from 'rxjs';

@Component({
  selector: 'menu-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input() public task: Task;
  public status: TaskStatus;
  public taskUrl: string;
  private statusSheet: MatBottomSheet;
  private tasksStore: Store<TasksState>;
  private notificationService: NotificationService;
  private taskStatusContainer: TaskStatusContainer;
  private doneStatusAvailable: boolean;
  private subscription: Subscription;

  public constructor(
    statusSheet: MatBottomSheet,
    tasksStore: Store<TasksState>,
    taskStatusContainer: TaskStatusContainer,
    notificationService: NotificationService
  ) {
    this.statusSheet = statusSheet;
    this.tasksStore = tasksStore;
    this.notificationService = notificationService;
    this.taskStatusContainer = taskStatusContainer;
  }

  public ngOnInit(): void {
    this.status = this.taskStatusContainer.getStatus(this.task.status);
    this.taskUrl = PathUtils.concatPath(RoutingConfig.tasks, RoutingConfig.task, this.task.id);
    this.doneStatusAvailable = false;
    this.subscription = this.tasksStore.select(selectUndoneOrNotRejectedSubtasks(
      this.task.id,
      this.taskStatusContainer.getUndoneStatusId(),
      this.taskStatusContainer.getRejectedStatusId()
    ))
      .pipe(map(tasks => tasks.length === 0))
      .subscribe(available => this.doneStatusAvailable = available);
  }

  public openStatusSheet(): void {
    const sheetRef = this.statusSheet.open(StatusSheetComponent, {
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

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
