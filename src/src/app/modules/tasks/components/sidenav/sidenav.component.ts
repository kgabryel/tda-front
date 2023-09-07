import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {doubleToolbarBreakPoint} from '../../../../config/sizes.config';
import {map} from 'rxjs/operators';
import {TaskPinned, TaskPinnedService, Type} from '../../../../core/services/task-pinned/task-pinned.service';

@Component({
  selector: 'tasks-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent implements OnInit {

  public small$: Observable<boolean>;
  public showed$: Observable<TaskPinned>;
  private breakpointObserver: BreakpointObserver;
  private taskPinnedService: TaskPinnedService;

  public constructor(breakpointObserver: BreakpointObserver, taskPinnedService: TaskPinnedService) {
    this.breakpointObserver = breakpointObserver;
    this.taskPinnedService = taskPinnedService;
  }

  public ngOnInit(): void {
    this.showed$ = this.taskPinnedService.getState();
    this.close();
    this.small$ = this.breakpointObserver.observe(doubleToolbarBreakPoint).pipe(map(size => size.matches));
  }

  public close(): void {
    this.taskPinnedService.changeStatus({
      open: false,
      taskId: '',
      type: Type.empty
    });
  }
}
