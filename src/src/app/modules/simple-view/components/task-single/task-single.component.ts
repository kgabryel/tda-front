import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../../../core/models/task';
import {Observable} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {TaskStatus} from '../../../../core/models/task-status';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {b2} from '../../../../config/sizes.config';

@Component({
  selector: 'simple-view-task-single',
  templateUrl: './task-single.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskSingleComponent implements OnInit {

  @Input() public task: Task;
  @Input() public delete: boolean = false;
  public taskStatus: TaskStatus;
  public small$: Observable<boolean>;
  @Output() private undo: EventEmitter<string>;
  private breakpointObserver: BreakpointObserver;
  private taskStatusContainer: TaskStatusContainer;

  public constructor(breakpointObserver: BreakpointObserver, taskStatusContainer: TaskStatusContainer) {
    this.breakpointObserver = breakpointObserver;
    this.taskStatusContainer = taskStatusContainer;
    this.undo = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this.small$ = this.breakpointObserver.observe(b2).pipe(map(data => data.matches));
    this.taskStatus = this.taskStatusContainer.getStatus(this.task.status);
  }

  public remove(): void {
    this.undo.emit(this.task.id);
  }
}
