import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'auth-page-change-password',
  templateUrl: './change-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {

  public token: string;
  private route: ActivatedRoute;
  private router: Router;

  public constructor(route: ActivatedRoute, router: Router) {
    this.route = route;
    this.router = router;
  }

  public ngOnInit(): void {
    this.token = this.route.snapshot.queryParams.token;
    if (this.token === undefined) {
      this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
    }
  }
}
