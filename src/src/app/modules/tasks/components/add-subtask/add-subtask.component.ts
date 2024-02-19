import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formNames, SubtaskFormFactory, TasksFormNames} from '../../../../core/factories/task.factory';
import {singleTaskErrors, SingleTaskErrors} from '../../../../core/errors/tasks.error';
import {SingleTaskRequest} from '../../../../core/requests/tasks.request';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/tasks/reducers';
import {tasksSingleAdd} from '../../../../core/store/tasks/actions';
import {Length} from '../../../../config/form.config';
import {Observable} from 'rxjs';
import {FormUtils} from '../../../../core/utils/form.utils';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'tasks-add-subtask',
  templateUrl: './add-subtask.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddSubtaskComponent implements OnInit {

  public form: FormGroup;
  public formNames: TasksFormNames;
  public errors: SingleTaskErrors;
  public nameLength$: Observable<number>;
  public maxNameLength: number;
  @Input() public taskId: string;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.formNames = formNames;
    this.errors = singleTaskErrors;
    this.store = store;
    this.maxNameLength = Length.maxTaskNameLength;
  }

  public ngOnInit(): void {
    this.form = SubtaskFormFactory.getForm();
    this.nameLength$ = this.form.get(this.formNames.name).valueChanges.pipe(startWith(''), map(name => name.length));
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const task: SingleTaskRequest = {
      alarm: null,
      task: {
        name: this.form.get(formNames.name).value,
        content: null,
        date: null,
        mainTask: this.taskId,
        bookmarks: [],
        files: [],
        notes: [],
        videos: [],
        catalogs: []
      }
    };
    this.store.dispatch(tasksSingleAdd({task, redirect: false}));
    FormUtils.clearInputs(this.form, '', this.formNames.name);
  }
}
