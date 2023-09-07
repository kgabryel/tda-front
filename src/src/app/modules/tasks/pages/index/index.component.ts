import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, timer} from 'rxjs';
import {Task} from '../../../../core/models/task';
import {Store} from '@ngrx/store';
import {debounce, filter, switchMap} from 'rxjs/operators';
import {State} from '../../../../core/store/tasks/reducers';
import {searchTasks} from '../../../../core/store/tasks/selectors';
import {SearchComponent} from '../../components/search/search.component';
import {MatDialog} from '@angular/material/dialog';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {TasksSearchService} from '../../../../core/services/tasks-search/tasks-search.service';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';

@Component({
  selector: 'tasks-pages-index',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  public tasks$: Observable<Task[]>;
  private store: Store<State>;
  private dialog: MatDialog;
  private modal: Observable<boolean>;
  private subscription: Subscription;
  private tasksSearchService: TasksSearchService;
  private taskStatusContainer: TaskStatusContainer;

  public constructor(
    store: Store<State>,
    dialog: MatDialog,
    modalService: ModalService,
    tasksSearchService: TasksSearchService,
    taskStatusContainer: TaskStatusContainer
  ) {
    this.store = store;
    this.dialog = dialog;
    this.modal = modalService.getState();
    this.tasksSearchService = tasksSearchService;
    this.taskStatusContainer = taskStatusContainer;
  }

  public ngOnInit(): void {
    this.tasks$ = this.tasksSearchService.getState().pipe(
      switchMap(search => this.store.select(searchTasks(
        search,
        this.taskStatusContainer.getDoneStatusId(),
        this.taskStatusContainer.getRejectedStatusId()
      ))),
      debounce(() => timer(200))
    );

    this.subscription = this.modal.pipe(filter(data => data))
      .subscribe(() => this.dialog.open(SearchComponent, {autoFocus: false}));
    this.dialog.closeAll();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
