import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {formNames, TasksFormNames} from '../../../../../core/factories/task.factory';
import {intervalAlarmTypes, Type} from '../../../../../config/interval-types.config';
import {periodicTaskErrors, PeriodicTaskErrors} from '../../../../../core/errors/tasks.error';
import {Length} from '../../../../../config/form.config';

@Component({
  selector: 'tasks-periodic-task-part',
  templateUrl: './task-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskPartComponent {

  public types: Type[];
  @Input() public form: FormGroup;
  public formNames: TasksFormNames;
  public errors: PeriodicTaskErrors;
  public maxNameLength: number;

  public constructor() {
    this.formNames = formNames;
    this.types = intervalAlarmTypes;
    this.errors = periodicTaskErrors;
    this.maxNameLength = Length.maxTaskNameLength;
  }
}
