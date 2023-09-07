import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {StoreService} from '../../../../core/services/store/store.service';
import {EventsService} from '../../../../core/services/events/events.service';

@Component({
  selector: 'header-logout',
  templateUrl: './logout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent {

  private router: Router;
  private readonly storeService: StoreService;
  private readonly eventsService: EventsService;

  public constructor(router: Router, storeService: StoreService, eventsService: EventsService) {
    this.router = router;
    this.storeService = storeService;
    this.eventsService = eventsService;
  }

  public logout(): void {
    this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
    AuthService.clearTokens(this.storeService, this.eventsService);
  }
}
