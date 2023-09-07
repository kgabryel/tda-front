import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Item} from '../../../../core/models/item';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {FormFactory} from '../../../../core/factories/form.factory';
import {Subscription} from 'rxjs';
import {formNames} from '../../../../core/factories/file.factory';
import {TaskSearch} from '../../../../core/models/task';

@Component({
  selector: 'tasks-tasks-filter',
  templateUrl: './tasks-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksFilterComponent implements OnInit, OnDestroy {

  public startDate: FormControl;
  public stopDate: FormControl;
  public statuses: Item[];
  public statusesGroup: FormGroup;
  @Output() private search: EventEmitter<TaskSearch>;
  private subscriptions: Subscription[];

  public constructor(taskStatusContainer: TaskStatusContainer) {
    this.search = new EventEmitter<TaskSearch>();
    this.statuses = taskStatusContainer.getStatuses().map(status => ItemUtils.taskStatusToItem(status));
  }

  public ngOnInit(): void {
    this.statusesGroup = FormFactory.getGroup();
    this.startDate = new FormControl();
    this.stopDate = new FormControl();
    this.subscriptions = [
      this.statusesGroup.get(formNames.items).valueChanges.subscribe(() => this.emitSearch()),
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
      statuses: this.statusesGroup.get(formNames.items).value.map(value => parseInt(value)),
      start: this.startDate.value,
      stop: this.stopDate.value
    });
  }
}
