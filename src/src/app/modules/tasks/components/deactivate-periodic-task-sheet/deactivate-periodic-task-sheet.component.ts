import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Observable} from 'rxjs';
import {Task} from '../../../../core/models/task';
import {map} from 'rxjs/operators';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';

@Component({
  selector: 'tasks-deactivate-periodic-task-sheet',
  templateUrl: './deactivate-periodic-task-sheet.component.html',
  styleUrls: ['./deactivate-periodic-task-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeactivatePeriodicTaskSheetComponent {

  public state$: Observable<number>;
  private bottomSheetRef: MatBottomSheetRef<DeactivatePeriodicTaskSheetComponent>;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { tasks$: Observable<Task[]> },
    bottomSheetRef: MatBottomSheetRef<DeactivatePeriodicTaskSheetComponent>,
    taskStatusContainer: TaskStatusContainer
  ) {
    const statusesToSkip = [
      taskStatusContainer.getRejectedStatusId(),
      taskStatusContainer.getDoneStatusId(),
      taskStatusContainer.getUndoneStatusId()
    ];
    this.state$ = data.tasks$.pipe(map(tasks => {
      if (tasks.length === 0) {
        return 0;
      }
      return tasks.filter(task => !statusesToSkip.includes(task.status)).length === 0 ? 1 : 2;
    }));
    this.bottomSheetRef = bottomSheetRef;
  }

  public close(value: string | null): void {
    this.bottomSheetRef.dismiss(value);
  }
}
