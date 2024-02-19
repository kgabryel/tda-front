import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/settings/reducers';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {confirmEmail} from '../../../../core/store/settings/actions';

@Component({
  selector: 'settings-pages-confirm-email',
  templateUrl: './confirm-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmEmailComponent implements OnInit {

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
      this.notificationService.showErrorMessage('settings.codeMissing');
      this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.settings));
    } else {
      this.store.dispatch(confirmEmail({code}));
    }
  }
}
