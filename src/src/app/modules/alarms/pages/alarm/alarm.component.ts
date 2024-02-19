import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Alarm} from '../../../../core/models/alarm';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {tap} from 'rxjs/operators';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {State} from '../../../../core/store/alarms/reducers';
import {selectAlarm} from '../../../../core/store/alarms/selectors';

@Component({
  selector: 'alarm-pages-alarm',
  templateUrl: './alarm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmComponent implements OnInit {

  public alarm$: Observable<Alarm>;
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
    this.alarm$ = this.store.select(selectAlarm(this.route.snapshot.paramMap.get('id'))).pipe(
      tap(alarm => {
        if (alarm === undefined) {
          this.router.navigate([PathUtils.concatPath(RoutingConfig.alarms)]);
        }
      }));
  }
}
