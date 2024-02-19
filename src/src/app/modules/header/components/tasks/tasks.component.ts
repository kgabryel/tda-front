import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {State} from '../../../../core/store/tasks/reducers';
import {selectTasksToDone} from '../../../../core/store/tasks/selectors';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'header-tasks',
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit, OnDestroy {

  public length$: Observable<number>;
  public toDoPath: string;
  @Output() private isEmpty: EventEmitter<boolean>;
  private store: Store<State>;
  private subscription: Subscription;

  public constructor(store: Store<State>) {
    this.toDoPath = PathUtils.concatPath(RoutingConfig.tasks, RoutingConfig.toDo);
    this.store = store;
    this.isEmpty = new EventEmitter<boolean>();
  }

  public ngOnInit(): void {
    this.length$ = this.store.select(selectTasksToDone).pipe(map(tasks => tasks.length));
    this.subscription = this.length$.subscribe(length => this.isEmpty.emit(length === 0));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
