import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, timer} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/videos/reducers';
import {searchVideos} from '../../../../core/store/videos/selectors';
import {debounce, filter, switchMap} from 'rxjs/operators';
import {Video} from '../../../../core/models/video';
import {SearchComponent} from '../../components/search/search.component';
import {MatDialog} from '@angular/material/dialog';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {VideosSearchService} from '../../../../core/services/videos-search/videos-search.service';
import {SearchService} from '../../../../core/services/search/search.service';

@Component({
  selector: 'videos-pages-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  public videos$: Observable<Video[]>;
  public search$: BehaviorSubject<boolean>;
  private store: Store<State>;
  private dialog: MatDialog;
  private modal: Observable<boolean>;
  private subscription: Subscription;
  private videosSearchService: VideosSearchService;
  private searchService: SearchService;

  public constructor(
    store: Store<State>,
    dialog: MatDialog,
    modalService: ModalService,
    videosSearchService: VideosSearchService,
    searchService: SearchService
  ) {
    this.store = store;
    this.dialog = dialog;
    this.modal = modalService.getState();
    this.videosSearchService = videosSearchService;
    this.search$ = new BehaviorSubject<boolean>(false);
    this.searchService = searchService;
  }

  public ngOnInit(): void {
    this.videos$ = this.videosSearchService.getState().pipe(
      switchMap(search => this.store.select(searchVideos(search))),
      debounce(() => timer(200))
    );
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    this.subscription = this.modal.pipe(filter(data => data))
      .subscribe(() => this.dialog.open(SearchComponent, {autoFocus: false}));
    this.searchService.getSearchState().pipe(filter(search => search))
      .subscribe(() => this.search$.next(true));
    this.videos$.subscribe(() => this.search$.next(false));
    this.dialog.closeAll();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
