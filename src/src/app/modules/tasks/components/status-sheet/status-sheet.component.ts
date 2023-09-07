import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {TaskStatus} from '../../../../core/models/task-status';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {taskStatuses} from '../../../../config/task-statuses.config';

@Component({
  selector: 'tasks-status-sheet',
  templateUrl: './status-sheet.component.html',
  styleUrls: ['./status-sheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusSheetComponent implements OnInit {

  public inactive: number;
  public doneDisabled: boolean;
  public taskStatuses: TaskStatus[];
  public doneName: string;
  private bottomSheetRef: MatBottomSheetRef<StatusSheetComponent>;
  private taskStatusContainer: TaskStatusContainer;
  private readonly subtasksCount: number;

  public constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: { without: number, doneDisabled: boolean, subtasksCount: number },
    bottomSheetRef: MatBottomSheetRef<StatusSheetComponent>,
    taskStatusContainer: TaskStatusContainer
  ) {
    this.inactive = data.without;
    this.doneDisabled = data.doneDisabled;
    this.subtasksCount = data.subtasksCount;
    this.bottomSheetRef = bottomSheetRef;
    this.taskStatusContainer = taskStatusContainer;
    this.doneName = taskStatuses.done;
  }

  public ngOnInit(): void {
    this.taskStatuses = this.taskStatusContainer.getStatuses();
  }

  public changeStatus(status: number): void {
    this.bottomSheetRef.dismiss(status);
  }

  public getTranslations(statusName: string): string | null {
    if (this.subtasksCount > 0 && (statusName === taskStatuses.undone || statusName === taskStatuses.rejected)) {
      return 'tooltips.statusWillBeDuplicated';
    }
    if (statusName === taskStatuses.done && this.doneDisabled) {
      return 'tooltips.statusDisabled';
    }
    return null;
  }
}
