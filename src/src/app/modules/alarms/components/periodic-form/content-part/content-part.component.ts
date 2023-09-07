import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AlarmsFormNames, formNames} from '../../../../../core/factories/alarm.factory';
import {periodicAlarmErrors, PeriodicAlarmErrors} from '../../../../../core/errors/alarms.error';

@Component({
  selector: 'alarms-periodic-content-part',
  templateUrl: './content-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentPartComponent {

  @Input() public form: FormGroup;
  public formNames: AlarmsFormNames;
  public errors: PeriodicAlarmErrors;

  public constructor() {
    this.formNames = formNames;
    this.errors = periodicAlarmErrors;
  }
}
