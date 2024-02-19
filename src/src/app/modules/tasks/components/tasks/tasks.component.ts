import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Task} from '../../../../core/models/task';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {PaginatePipeArgs} from 'ngx-pagination/dist/paginate.pipe';

@Component({
  selector: 'tasks-tasks',
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {

  @Input() public tasks: Task[];

  public config$: BehaviorSubject<PaginatePipeArgs>;
  public limitField: FormControl;
  public pageField: FormControl;

  public constructor() {
    this.limitField = new FormControl('0');
    this.pageField = new FormControl(1);
  }

  public ngOnInit(): void {
    this.config$ = new BehaviorSubject<PaginatePipeArgs>({
      id: 'tasksTasks',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.tasks.length
    });
  }
}
