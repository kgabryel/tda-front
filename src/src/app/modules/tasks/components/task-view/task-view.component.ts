import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tasks/reducers';
import {Observable} from 'rxjs';
import {Task} from '../../../../core/models/task';
import {selectTask} from '../../../../core/store/tasks/selectors';

@Component({
  selector: 'tasks-task-view',
  templateUrl: './task-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskViewComponent implements OnInit {

  @Input() public id: string;
  public task$: Observable<Task>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.task$ = this.store.select(selectTask(this.id));
  }

}
