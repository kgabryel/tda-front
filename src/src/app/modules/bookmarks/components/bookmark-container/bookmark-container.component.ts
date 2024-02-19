import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Bookmark} from '../../../../core/models/bookmark';
import {SidenavService} from '../../../../core/services/sidenav/sidenav.service';
import {bookmarkDelete} from '../../../../core/store/bookmarks/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/bookmarks/reducers';
import {PinnedSidenavService, Type} from '../../../../core/services/pinned-sidenav/pinned-sidenav.service';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'bookmarks-bookmark-container',
  templateUrl: './bookmark-container.component.html',
  styleUrls: ['./bookmark-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookmarkContainerComponent implements OnInit {

  public active: boolean;
  @Input() public bookmark: Bookmark;
  private sidenavService: SidenavService<Bookmark>;
  private store: Store<State>;
  private pinnedSidenavService: PinnedSidenavService;
  private deleteSheet: MatBottomSheet;

  public constructor(
    store: Store<State>,
    sidenavService: SidenavService<Bookmark>,
    pinnedSidenavService: PinnedSidenavService,
    deleteSheet: MatBottomSheet
  ) {
    this.store = store;
    this.sidenavService = sidenavService;
    this.pinnedSidenavService = pinnedSidenavService;
    this.deleteSheet = deleteSheet;
  }

  public ngOnInit(): void {
    this.active = false;
  }

  public showOptions(): void {
    this.active = true;
  }

  public hideOptions(): void {
    this.active = false;
  }

  public edit(): void {
    this.sidenavService.changeStatus({
      open: true,
      model: this.bookmark
    });
  }

  public delete(): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.store.dispatch(bookmarkDelete({id: this.bookmark.id})));
  }

  public showTasks(): void {
    this.pinnedSidenavService.changeStatus({
      open: true,
      tasks: this.bookmark.tasks,
      catalogs: [],
      type: Type.tasks
    });
  }

  public showCatalogs(): void {
    this.pinnedSidenavService.changeStatus({
      open: true,
      tasks: [],
      catalogs: this.bookmark.catalogs,
      type: Type.catalogs
    });
  }
}
