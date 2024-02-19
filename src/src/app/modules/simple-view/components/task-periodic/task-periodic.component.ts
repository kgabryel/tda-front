import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from '../../../../core/models/task';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {Observable} from 'rxjs';
import {b2} from '../../../../config/sizes.config';
import {map} from 'rxjs/operators';

@Component({
  selector: 'simple-view-task-periodic',
  templateUrl: './task-periodic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskPeriodicComponent implements OnInit {

  @Input() public task: Task;
  @Input() public delete: boolean = false;
  public small$: Observable<boolean>;
  @Output() private undo: EventEmitter<string>;
  private taskStatusContainer: TaskStatusContainer;
  private breakpointObserver: BreakpointObserver;

  public constructor(breakpointObserver: BreakpointObserver, taskStatusContainer: TaskStatusContainer) {
    this.taskStatusContainer = taskStatusContainer;
    this.breakpointObserver = breakpointObserver;
    this.undo = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this.small$ = this.breakpointObserver.observe(b2).pipe(map(data => data.matches));
  }

  public remove(): void {
    this.undo.emit(this.task.id);
  }
}
