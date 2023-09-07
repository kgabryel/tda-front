import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Task} from '../../../../core/models/task';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tasks/reducers';
import {selectMainTasksToDone} from '../../../../core/store/tasks/selectors';

@Component({
  selector: 'tasks-pages-to-do',
  templateUrl: './to-do.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToDoComponent implements OnInit {

  public tasks$: Observable<Task[]>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.tasks$ = this.store.select(selectMainTasksToDone);
  }
}
