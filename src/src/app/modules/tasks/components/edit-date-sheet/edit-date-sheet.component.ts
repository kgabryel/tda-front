import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'tasks-edit-date-sheet',
  templateUrl: './edit-date-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditDateSheetComponent {

  public empty: boolean;
  private bottomSheetRef: MatBottomSheetRef<EditDateSheetComponent>;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { empty: boolean },
    bottomSheetRef: MatBottomSheetRef<EditDateSheetComponent>
  ) {
    this.empty = data.empty;
    this.bottomSheetRef = bottomSheetRef;
  }

  selectAction(action: number): void {
    this.bottomSheetRef.dismiss(action);
  }
}
