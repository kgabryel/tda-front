import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'tasks-delete-with-connected-sheet',
  templateUrl: './delete-with-connected-sheet.component.html',
  styleUrls: ['./delete-with-connected-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteWithConnectedSheetComponent implements OnInit {

  public deleteTasks: boolean | null;
  public deleteAlarm: boolean | null;
  public step: number;
  public tooltip: boolean;
  private bottomSheetRef: MatBottomSheetRef<DeleteWithConnectedSheetComponent>;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { withTooltip: boolean },
    bottomSheetRef: MatBottomSheetRef<DeleteWithConnectedSheetComponent>
  ) {
    this.bottomSheetRef = bottomSheetRef;
    this.tooltip = data.withTooltip;
  }

  public ngOnInit(): void {
    this.step = 1;
    this.deleteTasks = null;
    this.deleteAlarm = null;
  }

  public setDeleteTasks(value: boolean): void {
    this.deleteTasks = value;
    if (!value) {
      this.deleteAlarm = true;
    }
    this.step = 0;
  }

  public setDeleteAlarm(value: boolean): void {
    this.deleteAlarm = value;
    if (!value) {
      this.deleteTasks = true;
      this.step = 0;
      return;
    }
    this.step = 2;
  }

  public delete(): void {
    this.bottomSheetRef.dismiss({deleteTasks: this.deleteTasks, deleteAlarm: this.deleteAlarm});
  }
}
