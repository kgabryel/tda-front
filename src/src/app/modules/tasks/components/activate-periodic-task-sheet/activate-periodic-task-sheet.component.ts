import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Observable} from 'rxjs';
import {Task} from '../../../../core/models/task';

@Component({
  selector: 'tasks-activate-periodic-task-sheet',
  templateUrl: './activate-periodic-task-sheet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivatePeriodicTaskSheetComponent {

  public tasks$: Observable<Task[]>;
  private bottomSheetRef: MatBottomSheetRef<ActivatePeriodicTaskSheetComponent>;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { tasks$: Observable<Task[]> },
    bottomSheetRef: MatBottomSheetRef<ActivatePeriodicTaskSheetComponent>
  ) {
    this.tasks$ = data.tasks$;
    this.bottomSheetRef = bottomSheetRef;
  }

  public close(value: string | null): void {
    this.bottomSheetRef.dismiss(value);
  }
}
