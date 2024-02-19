import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {AlarmsFormNames, formNames} from '../../../../core/factories/alarm.factory';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/alarms/reducers';
import {selectSingleMainAlarms} from '../../../../core/store/alarms/selectors';
import {FormControl} from '@angular/forms';
import {Alarm} from '../../../../core/models/alarm';

@Component({
  selector: 'tasks-alarm-sheet',
  templateUrl: './alarm-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmSheetComponent implements OnInit {

  public alarms$: Observable<Alarm[]>;
  public formNames: AlarmsFormNames;
  public filteredAlarms$: Observable<Alarm[]>;
  public alarmInput: FormControl;
  public invalid: boolean;
  public selected: Alarm | null;
  private bottomSheetRef: MatBottomSheetRef<AlarmSheetComponent>;
  private store: Store<State>;
  private subscription: Subscription;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { selected: Alarm | null },
    bottomSheetRef: MatBottomSheetRef<AlarmSheetComponent>,
    store: Store<State>
  ) {
    this.bottomSheetRef = bottomSheetRef;
    this.formNames = formNames;
    this.store = store;
    this.selected = data.selected === undefined ? null : data.selected;
  }

  public ngOnInit(): void {
    this.invalid = this.selected === null;
    this.alarms$ = this.store.select(selectSingleMainAlarms)
      .pipe(map(alarms => alarms.filter(alarm => this.filterAlarms(alarm))));
    this.alarmInput = new FormControl();
    this.alarmInput.setValue(this.selected);
    this.subscription = this.alarmInput.valueChanges.subscribe(value => {
      this.invalid = typeof this.alarmInput.value === 'string';
      this.filter(value);
    });
  }

  public change(): void {
    this.bottomSheetRef.dismiss(this.alarmInput.value.id);
  }

  public close(): void {
    this.bottomSheetRef.dismiss(undefined);
  }

  public delete(): void {
    this.bottomSheetRef.dismiss(null);
  }

  displayFn(alarm: Alarm): string {
    return alarm ? alarm.name : '';
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private filter(value: string | Alarm): void {
    let search = typeof value === 'string' ? value : value.name;
    const filterValue = search.toLowerCase();
    this.filteredAlarms$ = this.alarms$.pipe(map(task => task.filter(task => task.name.toLowerCase()
      .indexOf(filterValue) === 0)));
  }

  private filterAlarms(alarm: Alarm): boolean {
    if (alarm.periodic) {
      return false;
    }
    if (this.selected === null) {
      return alarm.task === null;
    } else {
      if (alarm.id === this.selected.id) {
        return true;
      } else {
        return alarm.task === null;
      }
    }
  }
}
