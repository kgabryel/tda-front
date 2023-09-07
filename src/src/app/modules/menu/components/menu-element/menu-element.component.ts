import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {MenuElementData} from '../../../../core/data/menu-element.data';
import {withSingleView} from '../../../../config/menu-elements.config';
import {Subscription} from 'rxjs';

@Component({
  selector: 'menu-menu-element',
  templateUrl: './menu-element.component.html',
  styleUrls: ['./menu-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MenuElementComponent implements OnInit, OnDestroy {

  @Input() public data: MenuElementData;
  public active: boolean;
  private router: Router;
  private route: ActivatedRoute;
  private withSingleView: string[];
  private subscription: Subscription;

  public constructor(router: Router, route: ActivatedRoute) {
    this.router = router;
    this.route = route;
    this.withSingleView = withSingleView;
  }

  public ngOnInit(): void {
    this.setActive(this.route['_routerState'].snapshot.url);
    this.subscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(data => this.setActive((data as NavigationEnd).url));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setActive(url: string): void {
    this.active = false;
    if (url === this.data.href) {
      this.active = true;
    } else if (this.withSingleView.includes(this.data.href) && url.startsWith(this.data.href) && !url.endsWith('create')) {
      this.active = true;
    }
  }
}
