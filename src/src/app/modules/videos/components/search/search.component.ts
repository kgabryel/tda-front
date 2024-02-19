import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {FormControl, FormGroup} from '@angular/forms';
import {formNames} from '../../../../core/factories/file.factory';
import {VideosSearchService} from '../../../../core/services/videos-search/videos-search.service';
import {SearchService} from '../../../../core/services/search/search.service';
import {FormUtils} from '../../../../core/utils/form.utils';
import {FormFactory} from '../../../../core/factories/form.factory';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {Store} from '@ngrx/store';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as TasksState} from '../../../../core/store/tasks/reducers';
import {selectMainTasks} from '../../../../core/store/tasks/selectors';

@Component({
  selector: 'videos-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private static searchName: string = '';
  private static searchAssignedToDashboard: boolean | null = null;
  private static searchWatched: boolean | null = null;
  private static searchCatalogs: number[] = [];
  private static searchTasks: string[] = [];
  public name: FormControl;
  public tasks$: Observable<Item[]>;
  public catalogs$: Observable<Item[]>;
  public tasksGroup: FormGroup;
  public catalogsGroup: FormGroup;
  public assignedToDashboardControl: FormControl;
  public watchedControl: FormControl;
  public reset$: Subject<void>;
  private videosSearchService: VideosSearchService;
  private searchService: SearchService;
  private subscriptions: Subscription[];
  private catalogsStore: Store<CatalogsState>;
  private tasksStore: Store<TasksState>;

  public constructor(
    catalogsStore: Store<CatalogsState>,
    tasksStore: Store<TasksState>,
    videosSearchService: VideosSearchService,
    searchService: SearchService
  ) {
    this.tasksStore = tasksStore;
    this.catalogsStore = catalogsStore;
    this.reset$ = new Subject<void>();
    this.assignedToDashboardControl = new FormControl();
    this.watchedControl = new FormControl();
    this.videosSearchService = videosSearchService;
    this.searchService = searchService;
    this.name = new FormControl(SearchComponent.searchName);
    this.assignedToDashboardControl.setValue(SearchComponent.searchAssignedToDashboard);
    this.watchedControl.setValue(SearchComponent.searchWatched);
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
      this.watchedControl.valueChanges.subscribe(() => this.search(true)),
      this.name.valueChanges.subscribe(() => this.search(true))
    ];
    if (this.isUpdated()) {
      this.search(false);
    }
  }

  public clear(): void {
    this.name.setValue('');
    this.assignedToDashboardControl.setValue(null);
    this.watchedControl.setValue(null);
    FormUtils.clearMultiSelect(this.catalogsGroup);
    FormUtils.clearMultiSelect(this.tasksGroup);
    this.reset$.next();
    this.search(true);
  }

  public search(emitSearchStart: boolean): void {
    if (emitSearchStart) {
      this.searchService.startSearch();
    }
    this.videosSearchService.searchVideos({
      name: this.name.value,
      assignedToDashboard: this.assignedToDashboardControl.value,
      watched: this.watchedControl.value,
      catalogs: this.catalogsGroup.get(formNames.items).value,
      tasks: this.tasksGroup.get(formNames.items).value
    });
    this.emitSearch();
  }

  public ngOnDestroy(): void {
    SearchComponent.searchName = this.name.value;
    SearchComponent.searchAssignedToDashboard = this.assignedToDashboardControl.value;
    SearchComponent.searchWatched = this.watchedControl.value;
    SearchComponent.searchTasks = this.tasksGroup.get(formNames.items).value;
    SearchComponent.searchCatalogs = this.catalogsGroup.get(formNames.items).value;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private isUpdated(): boolean {
    return this.name.value !== '' ||
      this.assignedToDashboardControl.value !== null ||
      this.watchedControl.value !== null ||
      this.tasksGroup.get(formNames.items).value.length > 0 ||
      this.catalogsGroup.get(formNames.items).value.length > 0;
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }
}
