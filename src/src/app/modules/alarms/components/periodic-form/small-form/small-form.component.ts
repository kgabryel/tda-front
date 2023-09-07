import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AlarmsFormNames, formNames} from '../../../../../core/factories/alarm.factory';
import {Subject} from 'rxjs';

@Component({
  selector: 'alarms-periodic-small-form',
  templateUrl: './small-form.component.html',
  styleUrls: ['./small-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmallFormComponent {

  @Input() public form: FormGroup;
  public formNames: AlarmsFormNames;
  @Input() public reset$: Subject<void>;

  public constructor() {
    this.formNames = formNames;
  }
}
