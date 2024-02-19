import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {EditDateSheetComponent} from '../edit-date-sheet/edit-date-sheet.component';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'tasks-date',
  templateUrl: './date.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateComponent implements OnInit {

  @Input() public taskDate: string | null;
  public date: Date | null;
  public edit$: BehaviorSubject<boolean>;
  @Output() private valueChanged: EventEmitter<Date | null>;
  private statusSheet: MatBottomSheet;

  public constructor(statusSheet: MatBottomSheet) {
    this.valueChanged = new EventEmitter<Date | null>();
    this.statusSheet = statusSheet;
    this.edit$ = new BehaviorSubject<boolean>(false);
  }

  public ngOnInit(): void {
    this.date = this.taskDate !== null ? new Date(this.taskDate) : null;
    this.edit$.next(false);
  }

  public save(): void {
    this.valueChanged.emit(this.date);
    this.edit$.next(false);
  }

  public editDate(): void {
    const sheetRef = this.statusSheet.open(EditDateSheetComponent, {
      data: {empty: this.date === null}
    });
    sheetRef.afterDismissed()
      .subscribe(action => {
        switch (action) {
          case 1: {
            this.date = null;
            this.save();
            break;
          }
          case 2: {
            this.edit$.next(true);
            break;
          }
          default: {
            break;
          }
        }
      });
  }
}
