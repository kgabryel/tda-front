import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {menuElements} from '../../../../config/menu-elements.config';
import {Observable} from 'rxjs';
import {SidenavService, Wrapper} from '../../../../core/services/sidenav/sidenav.service';
import {ImagesConfig} from '../../../../config/images.config';
import {MenuElementData} from '../../../../core/data/menu-element.data';
import {LayoutConfig} from '../../../../config/layout.config';
import {Task} from '../../../../core/models/task';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tasks/reducers';
import {selectTasksForToday, selectUndoneTasks} from '../../../../core/store/tasks/selectors';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';

@Component({
  selector: 'menu-menu-sidenav',
  templateUrl: './menu-sidenav.component.html',
  styleUrls: ['./menu-sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MenuSidenavComponent implements OnInit {

  public menuElements: MenuElementData[];
  public showed$: Observable<Wrapper<void>>;
  public logoPath: string;
  public undoneTasks$: Observable<Task[]>;
  public tasksForToday$: Observable<Task[]>;
  private sidenavService: SidenavService<void>;
  private store: Store<State>;
  private taskStatusContainer: TaskStatusContainer;

  public constructor(
    @Inject(LayoutConfig.menuServiceName) sidenavService: SidenavService<void>,
    store: Store<State>,
    taskStatusContainer: TaskStatusContainer
  ) {
    this.sidenavService = sidenavService;
    this.logoPath = ImagesConfig.logoPath;
    this.store = store;
    this.taskStatusContainer = taskStatusContainer;
  }

  public ngOnInit(): void {
    this.showed$ = this.sidenavService.getState();
    this.menuElements = menuElements;
    this.undoneTasks$ = this.store.select(selectUndoneTasks(this.taskStatusContainer.getUndoneStatusId()));
    this.tasksForToday$ = this.store.select(selectTasksForToday(
      this.taskStatusContainer.getDoneStatusId(),
      this.taskStatusContainer.getUndoneStatusId()
    ));
  }

  public changeStatus($event): void {
    this.sidenavService.changeStatus({
      open: $event,
      model: null
    });
  }
}
