import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription, timer} from 'rxjs';
import {Catalog} from '../../../../core/models/catalog';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/catalogs/reducers';
import {searchCatalogs} from '../../../../core/store/catalogs/selectors';
import {MatDialog} from '@angular/material/dialog';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {SearchComponent} from '../../components/search/search.component';
import {CatalogsSearchService} from '../../../../core/services/catalogs-search/catalogs-search.service';
import {debounce, filter, switchMap} from 'rxjs/operators';
import {SearchService} from '../../../../core/services/search/search.service';

@Component({
  selector: 'catalogs-pages-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  public catalogs$: Observable<Catalog[]>;
  public search$: BehaviorSubject<boolean>;
  private store: Store<State>;
  private dialog: MatDialog;
  private modal: Observable<boolean>;
  private subscription: Subscription;
  private catalogsSearchService: CatalogsSearchService;
  private searchService: SearchService;

  public constructor(
    store: Store<State>,
    dialog: MatDialog,
    modalService: ModalService,
    catalogsSearchService: CatalogsSearchService,
    searchService: SearchService
  ) {
    this.store = store;
    this.dialog = dialog;
    this.modal = modalService.getState();
    this.catalogsSearchService = catalogsSearchService;
    this.search$ = new BehaviorSubject<boolean>(false);
    this.searchService = searchService;
  }

  public ngOnInit(): void {
    this.catalogs$ = this.catalogsSearchService.getState().pipe(
      switchMap(search => this.store.select(searchCatalogs(search))),
      debounce(() => timer(200))
    );
    this.subscription = this.modal.pipe(filter(data => data))
      .subscribe(() => this.dialog.open(SearchComponent, {autoFocus: false}));
    this.searchService.getSearchState().pipe(filter(search => search)).subscribe(() => this.search$.next(true));
    this.catalogs$.subscribe(() => this.search$.next(false));
    this.dialog.closeAll();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
