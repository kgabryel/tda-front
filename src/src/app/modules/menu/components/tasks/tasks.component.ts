import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Task} from '../../../../core/models/task';
import {map} from 'rxjs/operators';

@Component({
  selector: 'menu-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit {

  public expanded: boolean;
  @Input() public tasks: Observable<Task[]>;
  @Input() public headerName: string;
  public limit: number;
  public length$: Observable<number>;

  public constructor() {
    this.expanded = false;
    this.limit = 5;
  }

  public ngOnInit(): void {
    this.length$ = this.tasks.pipe(map(tasks => tasks.length));
  }

  public toggle(): void {
    this.expanded = !this.expanded;
  }
}
