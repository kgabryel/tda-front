import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SidenavService} from '../../../../core/services/sidenav/sidenav.service';
import {Bookmark} from '../../../../core/models/bookmark';

@Component({
  selector: 'bookmarks-new-bookmark',
  templateUrl: './new-bookmark.component.html',
  styleUrls: ['./new-bookmark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewBookmarkComponent implements OnInit {

  private sidenavService: SidenavService<Bookmark>;

  public constructor(sidenavService: SidenavService<Bookmark>) {
    this.sidenavService = sidenavService;
  }

  public ngOnInit(): void {
    this.sidenavService.changeStatus({
      open: false,
      model: null
    });
  }

  public showSidenav(): void {
    this.sidenavService.changeStatus({
      open: true,
      model: null
    });
  }
}
