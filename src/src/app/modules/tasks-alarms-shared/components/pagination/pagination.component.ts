import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PaginatePipeArgs} from 'ngx-pagination/dist/paginate.pipe';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/settings/reducers';
import {selectDefaultPagination} from '../../../../core/store/settings/selectors';
import {pageSizeOptions} from '../../../../config/pagination.config';
import {BehaviorSubject, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'shared-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnInit, OnDestroy {

  @Input() public config$: BehaviorSubject<PaginatePipeArgs>;
  public pageSizeOptions: string[];
  @Input() public limitField: FormControl;
  @Input() public pageField: FormControl;
  public maxPage$: BehaviorSubject<number>;
  private store: Store<State>;
  private subscriptions: Subscription[];

  public constructor(store: Store<State>) {
    this.pageSizeOptions = pageSizeOptions;
    this.store = store;
    this.maxPage$ = new BehaviorSubject<number>(1);
  }

  public ngOnInit(): void {
    this.subscriptions = [
      this.store.select(selectDefaultPagination).subscribe(value => {
        this.limitField.setValue(value);
        let config = this.config$.getValue();
        config.itemsPerPage = value;
        this.setMaxPage(config);
        this.config$.next(config);
      }),
      this.config$.subscribe(config => {
        this.limitField.setValue(config.itemsPerPage);
        this.pageField.setValue(config.currentPage);
      })
    ];
  }

  public onPageChange(event): void {
    let config = this.config$.getValue();
    config.currentPage = event;
    this.pageField.setValue(event);
    this.config$.next(config);
    window.scroll(0, 0);
  }

  public changePage(): void {
    let page = this.pageField.value;
    if (page > this.maxPage$.getValue()) {
      page = this.maxPage$.getValue();
      this.pageField.setValue(page);
    }
    let config = this.config$.getValue();
    config.currentPage = page;
    this.config$.next(config);
    window.scroll(0, 0);
  }

  public changePageLimit(value: MatSelectChange): void {
    let config = this.config$.getValue();
    config.itemsPerPage = value.value;
    this.setMaxPage(config);
    this.config$.next(config);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setMaxPage(config: PaginatePipeArgs): void {
    let total: number;
    let perPage: number;
    total = config.totalItems as number;
    perPage = config.itemsPerPage as number;
    let maxPage = Math.ceil(total / perPage);
    if (this.pageField.value > maxPage) {
      let config = this.config$.getValue();
      config.currentPage = maxPage;
      this.config$.next(config);
      this.pageField.setValue(maxPage);
    }
    this.maxPage$.next(maxPage);
  }
}
