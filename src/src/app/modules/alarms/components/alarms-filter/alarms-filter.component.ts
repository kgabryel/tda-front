import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {AlarmSearch} from '../../../../core/models/alarm';

@Component({
  selector: 'alarms-alarms-filter',
  templateUrl: './alarms-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmsFilterComponent implements OnInit {

  public startDate: FormControl;
  public stopDate: FormControl;
  public status: FormControl;
  @Output() private search: EventEmitter<AlarmSearch>;
  private subscriptions: Subscription[];

  public constructor(taskStatusContainer: TaskStatusContainer) {
    this.search = new EventEmitter<AlarmSearch>();

  }

  public ngOnInit(): void {
    this.startDate = new FormControl();
    this.stopDate = new FormControl();
    this.status = new FormControl();
    this.subscriptions = [
      this.status.valueChanges.subscribe(() => this.emitSearch()),
      this.startDate.valueChanges.subscribe(() => this.emitSearch()),
      this.stopDate.valueChanges.subscribe(() => this.emitSearch())
    ];
  }

  public clearStartDate(): void {
    this.startDate.setValue(null);
    this.emitSearch();
  }

  public clearStopDate(): void {
    this.stopDate.setValue(null);
    this.emitSearch();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private emitSearch(): void {
    this.search.emit({
      checked: this.status.value,
      start: this.startDate.value,
      stop: this.stopDate.value
    });
  }

}
