import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'tasks-condition-sheet',
  templateUrl: './condition-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionSheetComponent {

  public question: string;

  private bottomSheetRef: MatBottomSheetRef<ConditionSheetComponent>;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { question: string },
    bottomSheetRef: MatBottomSheetRef<ConditionSheetComponent>
  ) {
    this.bottomSheetRef = bottomSheetRef;
    this.question = data.question;
  }

  delete(action: boolean | null): void {
    this.bottomSheetRef.dismiss(action);
  }
}
