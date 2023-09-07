import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Observable} from 'rxjs';
import {Alarm} from '../../../../core/models/alarm';

@Component({
  selector: 'alarms-activate-periodic-alarm-sheet',
  templateUrl: './activate-periodic-alarm-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivatePeriodicAlarmSheetComponent {

  public alarms$: Observable<Alarm[]>;
  private bottomSheetRef: MatBottomSheetRef<ActivatePeriodicAlarmSheetComponent>;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { alarms$: Observable<Alarm[]> },
    bottomSheetRef: MatBottomSheetRef<ActivatePeriodicAlarmSheetComponent>
  ) {
    this.alarms$ = data.alarms$;
    this.bottomSheetRef = bottomSheetRef;
  }

  public close(value: string | null): void {
    this.bottomSheetRef.dismiss(value);
  }
}
