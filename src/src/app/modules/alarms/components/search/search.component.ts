import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {FormControl, FormGroup} from '@angular/forms';
import {formNames} from '../../../../core/factories/file.factory';
import {selectSettings} from '../../../../core/store/settings/selectors';
import {first, map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {AlarmsSearchService} from '../../../../core/services/alarms-search/alarms-search.service';
import {SearchService} from '../../../../core/services/search/search.service';
import {FormUtils} from '../../../../core/utils/form.utils';
import {FormFactory} from '../../../../core/factories/form.factory';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {ItemUtils} from '../../../../core/utils/item.utils';

@Component({
  selector: 'alarms-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private static searchName: string = '';
  private static searchContent: string = '';
  private static searchTask: boolean | null = null;
  private static searchType: boolean | null = null;
  private static searchStatus: boolean | null = null;
  private static searchStartDate: Date | null = null;
  private static searchStopDate: Date | null = null;
  private static searchCatalogs: number[] = [];
  private static edited: boolean = false;
  public name: FormControl;
  public content: FormControl;
  public catalogs$: Observable<Item[]>;
  public taskControl: FormControl;
  public typeControl: FormControl;
  public catalogsGroup: FormGroup;
  public startDate: FormControl;
  public stopDate: FormControl;
  public statusControl: FormControl;
  public reset$: Subject<void>;
  private alarmsSearchService: AlarmsSearchService;
  private searchService: SearchService;
  private settingsStore: Store<SettingsState>;
  private defaultStatusValue: boolean | null;
  private subscriptions: Subscription[];
  private catalogsStore: Store<CatalogsState>;

  public constructor(
    catalogsStore: Store<CatalogsState>,
    settingsStore: Store<SettingsState>,
    alarmsSearchService: AlarmsSearchService,
    searchService: SearchService
  ) {
    this.catalogsStore = catalogsStore;
    this.defaultStatusValue = null;
    this.taskControl = new FormControl();
    this.typeControl = new FormControl();
    this.statusControl = new FormControl();
    this.reset$ = new Subject<void>();
    this.alarmsSearchService = alarmsSearchService;
    this.searchService = searchService;
    this.settingsStore = settingsStore;
    this.name = new FormControl(SearchComponent.searchName);
    this.content = new FormControl(SearchComponent.searchContent);
    this.taskControl.setValue(SearchComponent.searchTask);
    this.startDate = new FormControl(SearchComponent.searchStartDate);
    this.stopDate = new FormControl(SearchComponent.searchStopDate);
    this.typeControl.setValue(SearchComponent.searchType);
    this.catalogsGroup = FormFactory.getGroup(SearchComponent.searchCatalogs);
    this.emitSearch();
  }

  public ngOnInit(): void {
    this.catalogs$ = this.catalogsStore.select(selectCatalogs)
      .pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.statusControl.setValue(SearchComponent.searchStatus);
    this.subscriptions = [
      this.settingsStore.select(selectSettings('hideInactiveAlarms')).subscribe(value => {
        if (!SearchComponent.edited) {
          this.statusControl.setValue(value ? false : null);
          SearchComponent.edited = true;
        }
        this.defaultStatusValue = value ? false : null;
        if (this.isUpdated()) {
          this.search(false);
        }
      }),
      this.catalogsGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.taskControl.valueChanges.subscribe(() => this.search(true)),
      this.typeControl.valueChanges.subscribe(() => this.search(true)),
      this.statusControl.valueChanges.subscribe(() => this.search(true)),
      this.name.valueChanges.subscribe(() => this.search(true)),
      this.content.valueChanges.subscribe(() => this.search(true)),
      this.startDate.valueChanges.subscribe(() => this.search(true)),
      this.stopDate.valueChanges.subscribe(() => this.search(true))
    ];
  }

  public clear(): void {
    this.name.setValue('');
    this.content.setValue('');
    this.taskControl.setValue(null);
    this.stopDate.setValue(null);
    this.stopDate.setValue(null);
    this.typeControl.setValue(null);
    FormUtils.clearMultiSelect(this.catalogsGroup);
    this.reset$.next();
    this.settingsStore.select(selectSettings('hideInactiveAlarms'))
      .pipe(first())
      .subscribe(value => this.statusControl.setValue(value));
    this.search(true);
    SearchComponent.edited = false;
  }

  public search(emitSearchStart: boolean): void {
    if (emitSearchStart) {
      this.searchService.startSearch();
    }
    this.alarmsSearchService.searchAlarms({
      name: this.name.value,
      content: this.content.value,
      task: this.taskControl.value,
      startDate: this.startDate.value,
      status: this.statusControl.value,
      stopDate: this.stopDate.value,
      type: this.typeControl.value,
      catalogs: this.catalogsGroup.get(formNames.items).value
    });
    this.emitSearch();
  }

  public clearStartDate(): void {
    this.startDate.setValue(null);
    this.search(true);
  }

  public clearStopDate(): void {
    this.stopDate.setValue(null);
    this.search(true);
  }

  public ngOnDestroy(): void {
    SearchComponent.searchName = this.name.value;
    SearchComponent.searchContent = this.content.value;
    SearchComponent.searchCatalogs = this.catalogsGroup.get(formNames.items).value;
    SearchComponent.searchStartDate = this.startDate.value;
    SearchComponent.searchStopDate = this.stopDate.value;
    SearchComponent.searchTask = this.taskControl.value;
    SearchComponent.searchType = this.typeControl.value;
    SearchComponent.searchStatus = this.statusControl.value;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private isUpdated(): boolean {
    return this.statusControl.value !== this.defaultStatusValue ||
      this.name.value !== '' ||
      this.content.value !== '' ||
      this.taskControl.value !== null ||
      this.catalogsGroup.get(formNames.items).value.length > 0 ||
      this.typeControl.value !== null;
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }
}
