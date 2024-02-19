import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {debounce, filter, switchMap} from 'rxjs/operators';
import {SearchComponent} from '../../components/search/search.component';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, Observable, Subscription, timer} from 'rxjs';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {File} from '../../../../core/models/file';
import {SearchService} from '../../../../core/services/search/search.service';
import {searchFiles} from '../../../../core/store/files/selectors';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/files/reducers';
import {FilesSearchService} from '../../../../core/services/files-search/files-search.service';

@Component({
  selector: 'files-pages-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  public files$: Observable<File[]>;
  public search$: BehaviorSubject<boolean>;
  private dialog: MatDialog;
  private modal: Observable<boolean>;
  private subscription: Subscription;
  private searchService: SearchService;
  private store: Store<State>;
  private filesSearchService: FilesSearchService;

  public constructor(
    dialog: MatDialog,
    modalService: ModalService,
    searchService: SearchService,
    store: Store<State>,
    filesSearchService: FilesSearchService
  ) {
    this.dialog = dialog;
    this.modal = modalService.getState();
    this.search$ = new BehaviorSubject<boolean>(false);
    this.searchService = searchService;
    this.store = store;
    this.filesSearchService = filesSearchService;
  }

  public ngOnInit(): void {
    this.files$ = this.filesSearchService.getState().pipe(
      switchMap(search => this.store.select(searchFiles(search))),
      debounce(() => timer(200))
    );
    this.subscription = this.modal.pipe(filter(data => data))
      .subscribe(() => this.dialog.open(SearchComponent, {autoFocus: false}));
    this.searchService.getSearchState().pipe(filter(search => search))
      .subscribe(() => this.search$.next(true));
    this.files$.subscribe(() => this.search$.next(false));
    this.dialog.closeAll();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
