import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/alarms/reducers';
import {alarmSingleDisable} from '../../../../core/store/alarms/actions';

@Component({
  selector: 'alarms-pages-deactivate-alarm',
  templateUrl: './deactivate-alarm.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeactivateAlarmComponent implements OnInit {

  private route: ActivatedRoute;
  private router: Router;
  private notificationService: NotificationService;
  private store: Store<State>;

  public constructor(
    route: ActivatedRoute,
    router: Router,
    notificationService: NotificationService,
    store: Store<State>
  ) {
    this.route = route;
    this.router = router;
    this.notificationService = notificationService;
    this.store = store;
  }

  public ngOnInit(): void {
    const code = this.route.snapshot.queryParams.code;
    if (code === undefined) {
      this.notificationService.showErrorMessage('alarms.codeMissing');
      this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.alarms));
    } else {
      this.store.dispatch(alarmSingleDisable({code}));
    }
  }
}
