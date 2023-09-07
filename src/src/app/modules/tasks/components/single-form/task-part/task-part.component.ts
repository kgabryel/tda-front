import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {formNames, TasksFormNames} from '../../../../../core/factories/task.factory';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {singleTaskErrors, SingleTaskErrors} from '../../../../../core/errors/tasks.error';
import {State} from '../../../../../core/store/tasks/reducers';
import {selectMainTasks} from '../../../../../core/store/tasks/selectors';
import {Item} from '../../../../../core/models/item';
import {Length} from '../../../../../config/form.config';
import {ItemUtils} from '../../../../../core/utils/item.utils';

@Component({
  selector: 'tasks-single-task-part',
  templateUrl: './task-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskPartComponent implements OnInit {

  @Input() public form: FormGroup;
  public tasks$: Observable<Item[]>;
  public formNames: TasksFormNames;
  public errors: SingleTaskErrors;
  @Input() public mainTask$: Observable<boolean>;
  public maxNameLength: number;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.maxNameLength = Length.maxTaskNameLength;
    this.store = store;
    this.formNames = formNames;
    this.errors = singleTaskErrors;
  }

  public ngOnInit(): void {
    this.tasks$ = this.store.select(selectMainTasks).pipe(
      map(tasks => tasks.filter(task => !task.periodic)),
      map(tasks => ItemUtils.tasksToItems(tasks))
    );
  }

  public clearDate(): void {
    this.form.get(this.formNames.date).setValue(null);
  }
}
