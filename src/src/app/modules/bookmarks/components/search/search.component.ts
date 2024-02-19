import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {FormControl, FormGroup} from '@angular/forms';
import {formNames} from '../../../../core/factories/file.factory';
import {SearchService} from '../../../../core/services/search/search.service';
import {BookmarksSearchService} from '../../../../core/services/bookmarks-search/bookmarks-search.service';
import {FormUtils} from '../../../../core/utils/form.utils';
import {FormFactory} from '../../../../core/factories/form.factory';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectMainTasks} from '../../../../core/store/tasks/selectors';
import {Store} from '@ngrx/store';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';

@Component({
  selector: 'bookmarks-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private static searchName: string = '';
  private static searchHref: string = '';
  private static searchAssignedToDashboard: boolean | null = null;
  private static searchCatalogs: number[] = [];
  private static searchTasks: string[] = [];
  public name: FormControl;
  public href: FormControl;
  public tasks$: Observable<Item[]>;
  public catalogs$: Observable<Item[]>;
  public tasksGroup: FormGroup;
  public catalogsGroup: FormGroup;
  public assignedToDashboardControl: FormControl;
  public reset$: Subject<void>;
  private bookmarksSearchService: BookmarksSearchService;
  private searchService: SearchService;
  private subscriptions: Subscription[];
  private catalogsStore: Store<CatalogsState>;
  private tasksStore: Store<TasksState>;

  public constructor(
    catalogsStore: Store<CatalogsState>,
    tasksStore: Store<TasksState>,
    bookmarksSearchService: BookmarksSearchService,
    searchService: SearchService
  ) {
    this.catalogsStore = catalogsStore;
    this.tasksStore = tasksStore;
    this.assignedToDashboardControl = new FormControl();
    this.reset$ = new Subject<void>();
    this.bookmarksSearchService = bookmarksSearchService;
    this.searchService = searchService;
    this.name = new FormControl(SearchComponent.searchName);
    this.href = new FormControl(SearchComponent.searchHref);
    this.assignedToDashboardControl.setValue(SearchComponent.searchAssignedToDashboard);
    this.tasksGroup = FormFactory.getGroup(SearchComponent.searchTasks);
    this.catalogsGroup = FormFactory.getGroup(SearchComponent.searchCatalogs);
    this.emitSearch();
  }

  public ngOnInit(): void {
    this.catalogs$ = this.catalogsStore.select(selectCatalogs)
      .pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.tasks$ = this.tasksStore.select(selectMainTasks).pipe(map(tasks => ItemUtils.tasksToItems(tasks)));
    this.subscriptions = [
      this.catalogsGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.tasksGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.assignedToDashboardControl.valueChanges.subscribe(() => this.search(true)),
      this.name.valueChanges.subscribe(() => this.search(true)),
      this.href.valueChanges.subscribe(() => this.search(true))
    ];
    if (this.isUpdated()) {
      this.search(false);
    }
  }

  public clear(): void {
    this.name.setValue('');
    this.href.setValue('');
    this.assignedToDashboardControl.setValue(null);
    FormUtils.clearMultiSelect(this.catalogsGroup);
    FormUtils.clearMultiSelect(this.tasksGroup);
    this.reset$.next();
    this.search(true);
  }

  public search(emitSearchStart: boolean): void {
    if (emitSearchStart) {
      this.searchService.startSearch();
    }
    this.bookmarksSearchService.searchBookmarks({
      name: this.name.value,
      href: this.href.value,
      assignedToDashboard: this.assignedToDashboardControl.value,
      catalogs: this.catalogsGroup.get(formNames.items).value,
      tasks: this.tasksGroup.get(formNames.items).value
    });
    this.emitSearch();
  }

  public ngOnDestroy(): void {
    SearchComponent.searchName = this.name.value;
    SearchComponent.searchHref = this.href.value;
    SearchComponent.searchAssignedToDashboard = this.assignedToDashboardControl.value;
    SearchComponent.searchTasks = this.tasksGroup.get(formNames.items).value;
    SearchComponent.searchCatalogs = this.catalogsGroup.get(formNames.items).value;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private isUpdated(): boolean {
    return this.name.value !== '' ||
      this.href.value !== '' ||
      this.assignedToDashboardControl.value ||
      this.tasksGroup.get(formNames.items).value.length > 0 ||
      this.catalogsGroup.get(formNames.items).value.length > 0;
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }
}
