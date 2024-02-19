import {ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, timer} from 'rxjs';
import {Bookmark} from '../../../../core/models/bookmark';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/bookmarks/reducers';
import {searchBookmarks} from '../../../../core/store/bookmarks/selectors';
import {ResizerService, Result, Sizes} from '../../../../core/services/resizer/resizer.service';
import {bookmarksSizes} from '../../../../config/sizes.config';
import {debounce, filter, switchMap} from 'rxjs/operators';
import {SearchComponent} from '../../components/search/search.component';
import {MatDialog} from '@angular/material/dialog';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {BookmarksSearchService} from '../../../../core/services/bookmarks-search/bookmarks-search.service';
import {SearchService} from '../../../../core/services/search/search.service';

@Component({
  selector: 'bookmarks-pages-index',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  public bookmarks$: Observable<Bookmark[]>;
  public width: string;
  public height: string;
  public search$: BehaviorSubject<boolean>;
  private store: Store<State>;
  private readonly sizes: Sizes;
  private resizer: ResizerService;
  private dialog: MatDialog;
  private modal: Observable<boolean>;
  private subscription: Subscription;
  private bookmarksSearchService: BookmarksSearchService;
  private searchService: SearchService;

  public constructor(
    store: Store<State>,
    resizer: ResizerService,
    dialog: MatDialog,
    modalService: ModalService,
    bookmarksSearchService: BookmarksSearchService,
    searchService: SearchService
  ) {
    this.store = store;
    this.resizer = resizer;
    this.sizes = bookmarksSizes;
    this.dialog = dialog;
    this.modal = modalService.getState();
    this.bookmarksSearchService = bookmarksSearchService;
    this.search$ = new BehaviorSubject<boolean>(false);
    this.searchService = searchService;
  }

  public ngOnInit(): void {
    this.bookmarks$ = this.bookmarksSearchService.getState().pipe(
      switchMap(search => this.store.select(searchBookmarks(search))),
      debounce(() => timer(200))
    );
    const sizes = this.resizer.calculateSizes(this.sizes, window.innerWidth, window.innerHeight);
    this.width = sizes.width;
    this.height = sizes.height;
    this.subscription = this.modal.pipe(filter(data => data))
      .subscribe(() => this.dialog.open(SearchComponent, {autoFocus: false}));
    this.searchService.getSearchState().pipe(filter(search => search))
      .subscribe(() => this.search$.next(true));
    this.bookmarks$.subscribe(() => this.search$.next(false));
    this.dialog.closeAll();
  }

  @HostListener('window:resize')
  public onResize(): void {
    const sizes: Result = this.resizer.calculateSizes(this.sizes, window.innerWidth, window.innerHeight);
    this.width = sizes.width;
    this.height = sizes.height;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
