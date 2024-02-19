import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {doubleToolbarBreakPoint} from '../../../../config/sizes.config';
import {map} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {SearchService} from '../../../../core/services/search/search.service';

@Component({
  selector: 'header-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ToolbarComponent implements OnInit, OnDestroy {

  public small$: Observable<boolean>;
  public emptyTasks: boolean;
  public emptyAlarms: boolean;
  public searchAvailable: boolean;
  private breakpointObserver: BreakpointObserver;
  private router: Router;
  private subscription: Subscription;

  public constructor(breakpointObserver: BreakpointObserver, router: Router) {
    this.breakpointObserver = breakpointObserver;
    this.emptyTasks = false;
    this.emptyTasks = false;
    this.router = router;
  }

  public ngOnInit(): void {
    this.searchAvailable = SearchService.searchIsActive(this.router.routerState.snapshot.url);
    this.subscription = this.router.events.subscribe(redirect => {
      if (redirect instanceof NavigationEnd) {
        this.searchAvailable = SearchService.searchIsActive(redirect.url);
      }
    });
    this.small$ = this.breakpointObserver.observe(doubleToolbarBreakPoint).pipe(map(data => data.matches));
  }

  public checkAlarms(isEmpty: boolean): void {
    this.emptyAlarms = isEmpty;
  }

  public checkTasks(isEmpty: boolean): void {
    this.emptyTasks = isEmpty;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
