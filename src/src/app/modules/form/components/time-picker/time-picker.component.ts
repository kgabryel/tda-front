import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import {darkTheme, lightTheme} from '../../../../config/time-picker.config';
import {FormGroup} from '@angular/forms';
import {AlarmsFormNames, formNames} from '../../../../core/factories/alarm.factory';
import {Observable} from 'rxjs';
import {ModeService} from '../../../../core/services/mode/mode.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'form-time-picker',
  templateUrl: './time-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerComponent implements OnInit {

  public theme$: Observable<NgxMaterialTimepickerTheme>;
  @Input() public label: string;
  @Input() public parentForm: FormGroup;
  public formNames: AlarmsFormNames;
  private modeService: ModeService;

  public constructor(modeService: ModeService) {
    this.formNames = formNames;
    this.modeService = modeService;
  }

  public ngOnInit(): void {
    this.theme$ = this.modeService.getState().pipe(map(mode => mode ? darkTheme : lightTheme));
  }
}
