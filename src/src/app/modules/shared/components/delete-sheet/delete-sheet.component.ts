import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'shared-delete-sheet',
  templateUrl: './delete-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteSheetComponent {

  public infoMessage: string | null;
  private bottomSheetRef: MatBottomSheetRef<DeleteSheetComponent>;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { infoMessage: string | null } | null,
    bottomSheetRef: MatBottomSheetRef<DeleteSheetComponent>
  ) {
    this.infoMessage = data?.infoMessage ?? null;
    this.bottomSheetRef = bottomSheetRef;
  }

  delete(action: boolean): void {
    this.bottomSheetRef.dismiss(action);
  }
}
