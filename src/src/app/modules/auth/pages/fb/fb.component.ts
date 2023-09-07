import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {AccessService} from '../../../../core/services/access/access.service';

@Component({
  selector: 'auth-pages-fb',
  templateUrl: './fb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FbComponent implements OnInit {

  private route: ActivatedRoute;
  private accessService: AccessService;
  private authService: AuthService;
  private router: Router;
  private notificationService: NotificationService;

  public constructor(
    route: ActivatedRoute,
    accessService: AccessService,
    authService: AuthService,
    router: Router,
    notificationService: NotificationService
  ) {
    this.route = route;
    this.accessService = accessService;
    this.authService = authService;
    this.router = router;
    this.notificationService = notificationService;
  }

  public ngOnInit(): void {
    let authToken = this.route.snapshot.queryParams.code;
    if (authToken !== undefined) {
      this.accessService.loginViaFb(authToken).subscribe(
        data => {
          if (data.isCorrect) {
            this.authService.storeToken(data);
            this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
          } else {
            this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
            this.notificationService.showErrorMessage('messages.authError');
          }
        });
    } else {
      this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
    }
  }
}
