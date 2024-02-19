import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SidenavService, Wrapper} from '../../../../core/services/sidenav/sidenav.service';
import {Observable} from 'rxjs';
import {doubleToolbarBreakPoint} from '../../../../config/sizes.config';
import {map} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Video} from '../../../../core/models/video';
import {Items, PinnedSidenavService, Type} from '../../../../core/services/pinned-sidenav/pinned-sidenav.service';

@Component({
  selector: 'videos-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent implements OnInit {

  public showed$: Observable<Wrapper<Video>>;
  public small$: Observable<boolean>;
  public showedPinned$: Observable<Items>;
  private sidenavService: SidenavService<Video>;
  private breakpointObserver: BreakpointObserver;
  private pinnedSidenavService: PinnedSidenavService;

  public constructor(
    sidenavService: SidenavService<Video>,
    breakpointObserver: BreakpointObserver,
    pinnedSidenavService: PinnedSidenavService
  ) {
    this.sidenavService = sidenavService;
    this.breakpointObserver = breakpointObserver;
    this.pinnedSidenavService = pinnedSidenavService;
  }

  public ngOnInit(): void {
    this.showed$ = this.sidenavService.getState();
    this.closePinned();
    this.showedPinned$ = this.pinnedSidenavService.getState();
    this.small$ = this.breakpointObserver.observe(doubleToolbarBreakPoint).pipe(map(size => size.matches));
  }

  public changeStatus($event): void {
    this.sidenavService.changeStatus({
      open: $event,
      model: null
    });
  }

  public closePinned(): void {
    this.pinnedSidenavService.changeStatus({
      open: false,
      tasks: [],
      catalogs: [],
      type: Type.empty
    });
  }
}
