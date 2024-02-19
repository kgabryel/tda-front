import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AlarmsFormNames, formNames} from '../../../../../core/factories/alarm.factory';
import {Subject} from 'rxjs';

@Component({
  selector: 'alarms-single-big-form',
  templateUrl: './big-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BigFormComponent {

  @Input() public form: FormGroup;
  public formNames: AlarmsFormNames;
  @Input() public reset$: Subject<void>;

  public constructor() {
    this.formNames = formNames;
  }
}
