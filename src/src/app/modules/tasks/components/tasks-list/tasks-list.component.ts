import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Task} from '../../../../core/models/task';
import {PaginatePipeArgs} from 'ngx-pagination/dist/paginate.pipe';
import {FormControl} from '@angular/forms';
import {SearchService} from '../../../../core/services/search/search.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'tasks-tasks-list',
  templateUrl: './tasks-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksListComponent implements OnInit, OnDestroy {

  @Input() public tasks$: Observable<Task[]>;
  public config$: BehaviorSubject<PaginatePipeArgs>;
  public limitField: FormControl;
  public pageField: FormControl;
  public search$: BehaviorSubject<boolean>;
  private subscription: Subscription;
  private searchService: SearchService;

  public constructor(searchService: SearchService) {
    this.search$ = new BehaviorSubject<boolean>(false);
    this.searchService = searchService;
  }

  public ngOnInit(): void {
    this.limitField = new FormControl('0');
    this.pageField = new FormControl(1);
    this.config$ = new BehaviorSubject<PaginatePipeArgs>({
      id: 'tasks',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: 1
    });
    this.subscription = this.tasks$.subscribe(tasks => {
      let config = this.config$.getValue();
      config.totalItems = tasks.length;
      this.config$.next(config);
    });
    this.searchService.getSearchState().pipe(filter(search => search)).subscribe(() => this.search$.next(true));
    this.tasks$.subscribe(() => this.search$.next(false));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
