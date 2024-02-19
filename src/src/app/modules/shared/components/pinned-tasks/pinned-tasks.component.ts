import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Task} from '../../../../core/models/task';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tasks/reducers';
import {searchPinned} from '../../../../core/store/tasks/selectors';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {StringUtils} from '../../../../core/utils/string.utils';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'shared-pinned-tasks',
  templateUrl: './pinned-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinnedTasksComponent implements OnInit, OnDestroy {

  @Input() public tasks: string[];
  public items: Task[];
  public name: FormControl;
  private store: Store<State>;
  private taskStatusContainer: TaskStatusContainer;
  private subscription: Subscription;

  public constructor(store: Store<State>, taskStatusContainer: TaskStatusContainer) {
    this.store = store;
    this.name = new FormControl('');
    this.tasks = [];
    this.items = [];
    this.taskStatusContainer = taskStatusContainer;
  }

  public ngOnInit(): void {
    this.name.setValue('');
    this.search();
    this.subscription = this.name.valueChanges.subscribe(() => this.search());
  }

  public search(): void {
    this.store.select(searchPinned(this.tasks, this.name.value))
      .subscribe(tasks => this.items = tasks.sort(
        (a, b) => StringUtils.compareString(a.name, b.name)
      ));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
