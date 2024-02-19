import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Alarm} from '../../../../core/models/alarm';
import {alarmCheck, alarmSingleDelete, alarmUncheck} from '../../../../core/store/alarms/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/alarms/reducers';
import {filter, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {b1} from '../../../../config/sizes.config';

@Component({
  selector: 'alarms-alarm-preview',
  templateUrl: './alarm-preview.component.html',
  styleUrls: ['./alarm-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmPreviewComponent implements OnInit {

  @Input() public alarm: Alarm;
  public small$: Observable<boolean>;
  private store: Store<State>;
  private breakpointObserver: BreakpointObserver;
  private deleteSheet: MatBottomSheet;

  public constructor(breakpointObserver: BreakpointObserver, store: Store<State>, deleteSheet: MatBottomSheet) {
    this.breakpointObserver = breakpointObserver;
    this.store = store;
    this.deleteSheet = deleteSheet;
  }

  public ngOnInit(): void {
    this.small$ = this.breakpointObserver.observe(b1).pipe(map(data => data.matches));
  }

  public deleteAlarm(): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.store.dispatch(alarmSingleDelete({id: this.alarm.id})));
  }

  public switchAlarm(): void {
    if (this.alarm.checked) {
      this.store.dispatch(alarmUncheck({id: this.alarm.id}));
    } else {
      this.store.dispatch(alarmCheck({id: this.alarm.id}));
    }
  }
}
