import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Observable} from 'rxjs';
import {Alarm} from '../../../../core/models/alarm';
import {map} from 'rxjs/operators';

@Component({
  selector: 'alarms-deactivate-periodic-alarm-sheet',
  templateUrl: './deactivate-periodic-alarm-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeactivatePeriodicAlarmSheetComponent {

  public state$: Observable<number>;
  private bottomSheetRef: MatBottomSheetRef<DeactivatePeriodicAlarmSheetComponent>;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { alarms$: Observable<Alarm[]> },
    bottomSheetRef: MatBottomSheetRef<DeactivatePeriodicAlarmSheetComponent>
  ) {
    this.state$ = data.alarms$.pipe(map(alarms => {
      if (alarms.length === 0) {
        return 0;
      }
      return alarms.filter(alarm => !alarm.checked).length === 0 ? 1 : 2;
    }));
    this.bottomSheetRef = bottomSheetRef;
  }

  public close(value: string | null): void {
    this.bottomSheetRef.dismiss(value);
  }
}
