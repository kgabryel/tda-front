import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskStatus} from '../../../../core/models/task-status';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {State} from '../../../../core/store/tasks/reducers';
import {Store} from '@ngrx/store';
import {selectTask} from '../../../../core/store/tasks/selectors';
import {Subscription} from 'rxjs';

@Component({
  selector: 'alarms-task-single',
  templateUrl: './task-single.component.html',
  styleUrls: ['./task-single.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskSingleComponent implements OnInit, OnDestroy {

  @Input() public taskId: string | null;
  @Input() public editable: boolean;
  public status: TaskStatus | null;
  @Output() private startEdit: EventEmitter<void>;
  private taskStatusContainer: TaskStatusContainer;
  private store: Store<State>;
  private subscription: Subscription;

  public constructor(taskStatusContainer: TaskStatusContainer, store: Store<State>) {
    this.taskStatusContainer = taskStatusContainer;
    this.store = store;
    this.startEdit = new EventEmitter<void>();
  }

  public ngOnInit(): void {
    if (this.taskId !== null) {
      this.subscription = this.store.select(selectTask(this.taskId))
        .subscribe(task => this.status = this.taskStatusContainer.getStatus(task.status));
    }
  }

  public emitStartEdit(): void {
    this.startEdit.emit();
  }

  public ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
