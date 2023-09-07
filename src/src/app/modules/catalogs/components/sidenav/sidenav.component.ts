import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SidenavService, Wrapper} from '../../../../core/services/sidenav/sidenav.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {doubleToolbarBreakPoint} from '../../../../config/sizes.config';
import {map} from 'rxjs/operators';
import {Catalog} from '../../../../core/models/catalog';

@Component({
  selector: 'catalogs-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent implements OnInit {

  public showed$: Observable<Wrapper<Catalog>>;
  public small$: Observable<boolean>;
  private sidenavService: SidenavService<Catalog>;
  private breakpointObserver: BreakpointObserver;

  public constructor(sidenavService: SidenavService<Catalog>, breakpointObserver: BreakpointObserver) {
    this.sidenavService = sidenavService;
    this.breakpointObserver = breakpointObserver;
  }

  public ngOnInit(): void {
    this.showed$ = this.sidenavService.getState();
    this.small$ = this.breakpointObserver.observe(doubleToolbarBreakPoint).pipe(map(size => size.matches));
  }

  public changeStatus($event): void {
    this.sidenavService.changeStatus({
      open: $event,
      model: null
    });
  }
}
