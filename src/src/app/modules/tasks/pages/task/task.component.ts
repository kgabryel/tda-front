import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Task} from '../../../../core/models/task';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {tap} from 'rxjs/operators';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {State} from '../../../../core/store/tasks/reducers';
import {selectTask} from '../../../../core/store/tasks/selectors';

@Component({
  selector: 'tasks-pages-task',
  templateUrl: './task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent implements OnInit {

  public task$: Observable<Task>;
  private store: Store<State>;
  private route: ActivatedRoute;
  private router: Router;

  public constructor(router: Router, store: Store<State>, route: ActivatedRoute) {
    router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.store = store;
    this.route = route;
    this.router = router;
  }

  public ngOnInit(): void {
    this.task$ = this.store.select(selectTask(this.route.snapshot.paramMap.get('id'))).pipe(
      tap(task => {
        if (task === undefined) {
          this.router.navigate([PathUtils.concatPath(RoutingConfig.any)], {skipLocationChange: true});
        }
      }));
  }
}
