import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {SidenavService, Wrapper} from '../../../../core/services/sidenav/sidenav.service';
import {Bookmark} from '../../../../core/models/bookmark';
import {BreakpointObserver} from '@angular/cdk/layout';
import {doubleToolbarBreakPoint} from '../../../../config/sizes.config';
import {map} from 'rxjs/operators';
import {Items, PinnedSidenavService, Type} from '../../../../core/services/pinned-sidenav/pinned-sidenav.service';

@Component({
  selector: 'bookmarks-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent implements OnInit {

  public showed$: Observable<Wrapper<Bookmark>>;
  public small$: Observable<boolean>;
  public showedPinned$: Observable<Items>;
  private sidenavService: SidenavService<Bookmark>;
  private breakpointObserver: BreakpointObserver;
  private pinnedSidenavService: PinnedSidenavService;

  public constructor(
    sidenavService: SidenavService<Bookmark>,
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

  public close(): void {
    this.sidenavService.changeStatus({
      open: false,
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
