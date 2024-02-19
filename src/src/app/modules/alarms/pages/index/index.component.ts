import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription, timer} from 'rxjs';
import {Alarm} from '../../../../core/models/alarm';
import {State} from '../../../../core/store/alarms/reducers';
import {debounce, filter, switchMap} from 'rxjs/operators';
import {searchAlarms} from '../../../../core/store/alarms/selectors';
import {SearchComponent} from '../../components/search/search.component';
import {MatDialog} from '@angular/material/dialog';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {AlarmsSearchService} from '../../../../core/services/alarms-search/alarms-search.service';
import {PaginatePipeArgs} from 'ngx-pagination/dist/paginate.pipe';
import {FormControl} from '@angular/forms';
import {SearchService} from '../../../../core/services/search/search.service';

@Component({
  selector: 'alarms-pages-index',
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  public alarms$: Observable<Alarm[]>;
  public config$: BehaviorSubject<PaginatePipeArgs>;
  public limitField: FormControl;
  public pageField: FormControl;
  public search$: BehaviorSubject<boolean>;
  private store: Store<State>;
  private dialog: MatDialog;
  private modal: Observable<boolean>;
  private subscriptions: Subscription[];
  private alarmsSearchService: AlarmsSearchService;
  private searchService: SearchService;

  public constructor(
    store: Store<State>,
    dialog: MatDialog,
    modalService: ModalService,
    alarmsSearchService: AlarmsSearchService,
    searchService: SearchService
  ) {
    this.store = store;
    this.dialog = dialog;
    this.search$ = new BehaviorSubject<boolean>(false);
    this.searchService = searchService;
    this.modal = modalService.getState();
    this.alarmsSearchService = alarmsSearchService;
  }

  public ngOnInit(): void {
    this.limitField = new FormControl('0');
    this.pageField = new FormControl(1);

    this.config$ = new BehaviorSubject<PaginatePipeArgs>({
      id: 'alarms',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: 1
    });
    this.alarms$ = this.alarmsSearchService.getState().pipe(
      switchMap(search => this.store.select(searchAlarms(search))),
      debounce(() => timer(200))
    );
    this.subscriptions = [
      this.alarms$.subscribe(alarms => {
        let config = this.config$.getValue();
        config.totalItems = alarms.length;
        this.config$.next(config);
      }),
      this.modal.pipe(filter(data => data))
        .subscribe(() => this.dialog.open(SearchComponent, {autoFocus: false}))
    ];
    this.searchService.getSearchState().pipe(filter(search => search)).subscribe(() => this.search$.next(true));
    this.alarms$.subscribe(() => this.search$.next(false));
    this.dialog.closeAll();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
