import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {FormControl, FormGroup} from '@angular/forms';
import {formNames} from '../../../../core/factories/file.factory';
import {selectNotes} from '../../../../core/store/notes/selectors';
import {first, map} from 'rxjs/operators';
import {selectBookmarks} from '../../../../core/store/bookmarks/selectors';
import {selectVideos} from '../../../../core/store/videos/selectors';
import {selectFiles} from '../../../../core/store/files/selectors';
import {Store} from '@ngrx/store';
import {State as NotesState} from '../../../../core/store/notes/reducers';
import {State as VideosState} from '../../../../core/store/videos/reducers';
import {State as FilesState} from '../../../../core/store/files/reducers';
import {State as SettingsState} from '../../../../core/store/settings/reducers';
import {State as BookmarksState} from '../../../../core/store/bookmarks/reducers';
import {selectSettings} from '../../../../core/store/settings/selectors';
import {TaskStatusContainer} from '../../../../core/containers/task-status.container';
import {TasksSearchService} from '../../../../core/services/tasks-search/tasks-search.service';
import {SearchService} from '../../../../core/services/search/search.service';
import {FormUtils} from '../../../../core/utils/form.utils';
import {FormFactory} from '../../../../core/factories/form.factory';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';

@Component({
  selector: 'tasks-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private static searchName: string = '';
  private static searchContent: string = '';
  private static searchAlarm: boolean | null = null;
  private static searchType: boolean | null = null;
  private static searchHideDone: boolean = false;
  private static searchHideRejected: boolean = false;
  private static searchStatuses: number[] = [];
  private static searchDate: boolean | null = null;
  private static searchSubtasks: boolean | null = null;
  private static searchStartDate: Date | null = null;
  private static searchStopDate: Date | null = null;
  private static searchCatalogs: number[] = [];
  private static searchNotes: number[] = [];
  private static searchBookmarks: number[] = [];
  private static searchFiles: number[] = [];
  private static searchVideos: number[] = [];
  private static hideEdited: boolean = false;
  private static rejectedEdited: boolean = false;
  private static searchActive: boolean | null = null;
  public name: FormControl;
  public content: FormControl;
  public catalogs$: Observable<Item[]>;
  public notes$: Observable<Item[]>;
  public bookmarks$: Observable<Item[]>;
  public files$: Observable<Item[]>;
  public videos$: Observable<Item[]>;
  public statuses: Item[];
  public catalogsGroup: FormGroup;
  public notesGroup: FormGroup;
  public bookmarksGroup: FormGroup;
  public filesGroup: FormGroup;
  public videosGroup: FormGroup;
  public statusesGroup: FormGroup;
  public hideDoneControl: FormControl;
  public hideRejectedControl: FormControl;
  public alarmControl: FormControl;
  public typeControl: FormControl;
  public dateControl: FormControl;
  public subtasksControl: FormControl;
  public activeControl: FormControl;
  public startDate: FormControl;
  public stopDate: FormControl;
  public reset$: Subject<void>;
  private tasksSearchService: TasksSearchService;
  private searchService: SearchService;
  private settingsStore: Store<SettingsState>;
  private defaultHideDoneValue: boolean;
  private defaultHideRejectedValue: boolean;
  private subscriptions: Subscription[];

  public constructor(
    taskStatusContainer: TaskStatusContainer,
    catalogsStore: Store<CatalogsState>,
    settingsStore: Store<SettingsState>,
    notesStore: Store<NotesState>,
    videosStore: Store<VideosState>,
    filesStore: Store<FilesState>,
    bookmarksStore: Store<BookmarksState>,
    tasksSearchService: TasksSearchService,
    searchService: SearchService
  ) {
    this.defaultHideDoneValue = null;
    this.defaultHideRejectedValue = null;
    this.hideDoneControl = new FormControl();
    this.hideRejectedControl = new FormControl();
    this.alarmControl = new FormControl();
    this.typeControl = new FormControl();
    this.dateControl = new FormControl();
    this.subtasksControl = new FormControl();
    this.activeControl = new FormControl();
    this.reset$ = new Subject<void>();
    this.tasksSearchService = tasksSearchService;
    this.searchService = searchService;
    this.settingsStore = settingsStore;
    this.name = new FormControl(SearchComponent.searchName);
    this.content = new FormControl(SearchComponent.searchContent);
    this.alarmControl.setValue(SearchComponent.searchAlarm);
    this.typeControl.setValue(SearchComponent.searchType);
    this.dateControl.setValue(SearchComponent.searchDate);
    this.subtasksControl.setValue(SearchComponent.searchSubtasks);
    this.hideDoneControl.setValue(SearchComponent.searchHideDone);
    this.hideRejectedControl.setValue(SearchComponent.searchHideRejected);
    this.activeControl.setValue(SearchComponent.searchActive);
    this.startDate = new FormControl(SearchComponent.searchStartDate);
    this.stopDate = new FormControl(SearchComponent.searchStopDate);
    this.statuses = taskStatusContainer.getStatuses().map(status => ItemUtils.taskStatusToItem(status));
    this.catalogs$ = catalogsStore.select(selectCatalogs)
      .pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
    this.notes$ = notesStore.select(selectNotes).pipe(map(notes => ItemUtils.notesToItems(notes)));
    this.bookmarks$ = bookmarksStore.select(selectBookmarks)
      .pipe(map(bookmarks => ItemUtils.bookmarksToItems(bookmarks)));
    this.videos$ = videosStore.select(selectVideos).pipe(map(videos => ItemUtils.videosToItems(videos)));
    this.files$ = filesStore.select(selectFiles).pipe(map(files => ItemUtils.filesToItems(files)));
    this.catalogsGroup = FormFactory.getGroup(SearchComponent.searchCatalogs);
    this.notesGroup = FormFactory.getGroup(SearchComponent.searchNotes);
    this.bookmarksGroup = FormFactory.getGroup(SearchComponent.searchBookmarks);
    this.filesGroup = FormFactory.getGroup(SearchComponent.searchFiles);
    this.videosGroup = FormFactory.getGroup(SearchComponent.searchVideos);
    this.statusesGroup = FormFactory.getGroup(SearchComponent.searchStatuses);
    this.emitSearch();
  }

  public ngOnInit(): void {
    this.hideDoneControl.setValue(SearchComponent.searchHideDone);
    this.hideRejectedControl.setValue(SearchComponent.searchHideRejected);
    this.subscriptions = [
      this.settingsStore.select(selectSettings('hideDoneTasks'))
        .subscribe(value => {
          if (!SearchComponent.hideEdited) {
            SearchComponent.hideEdited = true;
            this.hideDoneControl.setValue(value);
          }
          this.defaultHideDoneValue = value;
          if (this.isUpdated()) {
            this.search(false);
          }
        }),
      this.settingsStore.select(selectSettings('hideRejectedTasks'))
        .subscribe(value => {
          if (!SearchComponent.rejectedEdited) {
            SearchComponent.rejectedEdited = true;
            this.hideRejectedControl.setValue(value);
          }
          this.defaultHideRejectedValue = value;
          if (this.isUpdated()) {
            this.search(false);
          }
        }),
      this.catalogsGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.notesGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.bookmarksGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.filesGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.videosGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.statusesGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.hideDoneControl.valueChanges.subscribe(() => this.search(true)),
      this.hideRejectedControl.valueChanges.subscribe(() => this.search(true)),
      this.alarmControl.valueChanges.subscribe(() => this.search(true)),
      this.typeControl.valueChanges.subscribe(() => this.search(true)),
      this.dateControl.valueChanges.subscribe(() => this.search(true)),
      this.subtasksControl.valueChanges.subscribe(() => this.search(true)),
      this.activeControl.valueChanges.subscribe(() => this.search(true)),
      this.name.valueChanges.subscribe(() => this.search(true)),
      this.content.valueChanges.subscribe(() => this.search(true)),
      this.startDate.valueChanges.subscribe(() => this.search(true)),
      this.stopDate.valueChanges.subscribe(() => this.search(true))
    ];
  }

  public clear(): void {
    this.name.setValue('');
    this.content.setValue('');
    this.alarmControl.setValue(null);
    this.typeControl.setValue(null);
    this.dateControl.setValue(null);
    this.subtasksControl.setValue(null);
    this.startDate.setValue(null);
    this.stopDate.setValue(null);
    this.activeControl.setValue(null);
    FormUtils.clearMultiSelect(this.catalogsGroup);
    FormUtils.clearMultiSelect(this.statusesGroup);
    FormUtils.clearMultiSelect(this.notesGroup);
    FormUtils.clearMultiSelect(this.bookmarksGroup);
    FormUtils.clearMultiSelect(this.filesGroup);
    FormUtils.clearMultiSelect(this.videosGroup);
    this.reset$.next();
    this.settingsStore.select(selectSettings('hideDoneTasks'))
      .pipe(first())
      .subscribe(value => this.hideDoneControl.setValue(value));
    this.settingsStore.select(selectSettings('hideRejectedTasks'))
      .pipe(first())
      .subscribe(value => this.hideRejectedControl.setValue(value));
    this.search(true);
    SearchComponent.hideEdited = false;
    SearchComponent.rejectedEdited = false;
  }

  public search(emitSearchStart: boolean): void {
    if (emitSearchStart) {
      this.searchService.startSearch();
    }
    this.tasksSearchService.searchTasks({
      alarm: this.alarmControl.value,
      bookmarks: this.bookmarksGroup.get(formNames.items).value,
      catalogs: this.catalogsGroup.get(formNames.items).value,
      content: this.content.value,
      date: this.dateControl.value,
      files: this.filesGroup.get(formNames.items).value,
      hideDone: this.hideDoneControl.value,
      hideRejected: this.hideRejectedControl.value,
      name: this.name.value,
      notes: this.notesGroup.get(formNames.items).value,
      startDate: this.startDate.value,
      statuses: this.statusesGroup.get(formNames.items).value,
      stopDate: this.stopDate.value,
      subtasks: this.subtasksControl.value,
      type: this.typeControl.value,
      videos: this.videosGroup.get(formNames.items).value,
      active: this.activeControl.value
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
    SearchComponent.searchAlarm = this.alarmControl.value;
    SearchComponent.searchType = this.typeControl.value;
    SearchComponent.searchHideDone = this.hideDoneControl.value;
    SearchComponent.searchHideRejected = this.hideRejectedControl.value;
    SearchComponent.searchStatuses = this.statusesGroup.get(formNames.items).value;
    SearchComponent.searchDate = this.dateControl.value;
    SearchComponent.searchSubtasks = this.subtasksControl.value;
    SearchComponent.searchStartDate = this.startDate.value;
    SearchComponent.searchStopDate = this.stopDate.value;
    SearchComponent.searchCatalogs = this.catalogsGroup.get(formNames.items).value;
    SearchComponent.searchNotes = this.notesGroup.get(formNames.items).value;
    SearchComponent.searchBookmarks = this.bookmarksGroup.get(formNames.items).value;
    SearchComponent.searchFiles = this.filesGroup.get(formNames.items).value;
    SearchComponent.searchVideos = this.videosGroup.get(formNames.items).value;
    SearchComponent.searchActive = this.activeControl.value;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private isUpdated(): boolean {
    return this.hideDoneControl.value !== this.defaultHideDoneValue ||
      this.hideRejectedControl.value !== this.defaultHideRejectedValue ||
      this.name.value !== '' ||
      this.content.value !== '' ||
      this.alarmControl.value !== null ||
      this.catalogsGroup.get(formNames.items).value.length > 0 ||
      this.notesGroup.get(formNames.items).value.length > 0 ||
      this.bookmarksGroup.get(formNames.items).value.length > 0 ||
      this.filesGroup.get(formNames.items).value.length > 0 ||
      this.videosGroup.get(formNames.items).value.length > 0 ||
      this.typeControl.value !== null ||
      this.activeControl.value !== null;
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }
}
