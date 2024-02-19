import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {FormControl, FormGroup} from '@angular/forms';
import {formNames} from '../../../../core/factories/file.factory';
import {Store} from '@ngrx/store';
import {State as NotesState} from '../../../../core/store/notes/reducers';
import {State as VideosState} from '../../../../core/store/videos/reducers';
import {State as FilesState} from '../../../../core/store/files/reducers';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {selectMainAlarms} from '../../../../core/store/alarms/selectors';
import {map} from 'rxjs/operators';
import {selectNotes} from '../../../../core/store/notes/selectors';
import {selectBookmarks} from '../../../../core/store/bookmarks/selectors';
import {selectVideos} from '../../../../core/store/videos/selectors';
import {selectFiles} from '../../../../core/store/files/selectors';
import {State as BookmarksState} from '../../../../core/store/bookmarks/reducers';
import {CatalogsSearchService} from '../../../../core/services/catalogs-search/catalogs-search.service';
import {SearchService} from '../../../../core/services/search/search.service';
import {FormUtils} from '../../../../core/utils/form.utils';
import {FormFactory} from '../../../../core/factories/form.factory';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {selectMainTasks} from '../../../../core/store/tasks/selectors';
import {State as TasksState} from '../../../../core/store/tasks/reducers';

@Component({
  selector: 'catalogs-search',
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {

  private static searchName: string = '';
  private static searchAssignedToDashboard: boolean | null = null;
  private static searchAlarms: string[] = [];
  private static searchTasks: string[] = [];
  private static searchNotes: number[] = [];
  private static searchBookmarks: number[] = [];
  private static searchFiles: number[] = [];
  private static searchVideos: number[] = [];
  public name: FormControl;
  public tasks$: Observable<Item[]>;
  public alarms$: Observable<Item[]>;
  public notes$: Observable<Item[]>;
  public bookmarks$: Observable<Item[]>;
  public files$: Observable<Item[]>;
  public videos$: Observable<Item[]>;
  public tasksGroup: FormGroup;
  public alarmsGroup: FormGroup;
  public notesGroup: FormGroup;
  public bookmarksGroup: FormGroup;
  public filesGroup: FormGroup;
  public videosGroup: FormGroup;
  public assignedToDashboardControl: FormControl;
  public reset$: Subject<void>;
  private catalogsSearchService: CatalogsSearchService;
  private searchService: SearchService;
  private subscriptions: Subscription[];

  public constructor(
    tasksStore: Store<TasksState>,
    notesStore: Store<NotesState>,
    videosStore: Store<VideosState>,
    filesStore: Store<FilesState>,
    alarmsStore: Store<AlarmsState>,
    bookmarksStore: Store<BookmarksState>,
    catalogsSearchService: CatalogsSearchService,
    searchService: SearchService
  ) {
    this.assignedToDashboardControl = new FormControl();
    this.reset$ = new Subject<void>();
    this.catalogsSearchService = catalogsSearchService;
    this.searchService = searchService;
    this.name = new FormControl(SearchComponent.searchName);
    this.assignedToDashboardControl.setValue(SearchComponent.searchAssignedToDashboard);
    this.tasks$ = tasksStore.select(selectMainTasks).pipe(map(tasks => ItemUtils.tasksToItems(tasks)));
    this.alarms$ = alarmsStore.select(selectMainAlarms).pipe(map(alarms => ItemUtils.alarmsToItems(alarms)));
    this.notes$ = notesStore.select(selectNotes).pipe(map(notes => ItemUtils.notesToItems(notes)));
    this.bookmarks$ = bookmarksStore.select(selectBookmarks).pipe(map(bookmarks => ItemUtils.bookmarksToItems(bookmarks)));
    this.videos$ = videosStore.select(selectVideos).pipe(map(videos => ItemUtils.videosToItems(videos)));
    this.files$ = filesStore.select(selectFiles).pipe(map(files => ItemUtils.filesToItems(files)));
    this.tasksGroup = FormFactory.getGroup(SearchComponent.searchTasks);
    this.alarmsGroup = FormFactory.getGroup(SearchComponent.searchAlarms);
    this.notesGroup = FormFactory.getGroup(SearchComponent.searchNotes);
    this.bookmarksGroup = FormFactory.getGroup(SearchComponent.searchBookmarks);
    this.filesGroup = FormFactory.getGroup(SearchComponent.searchFiles);
    this.videosGroup = FormFactory.getGroup(SearchComponent.searchVideos);
    this.emitSearch();
  }

  public ngOnInit(): void {
    this.subscriptions = [
      this.alarmsGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.tasksGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.notesGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.bookmarksGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.filesGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.videosGroup.get(formNames.items).valueChanges.subscribe(() => this.search(true)),
      this.assignedToDashboardControl.valueChanges.subscribe(() => this.search(true)),
      this.name.valueChanges.subscribe(() => this.search(true))
    ];
    if (this.isUpdated()) {
      this.search(false);
    }
  }

  public clear(): void {
    this.name.setValue('');
    this.assignedToDashboardControl.setValue(null);
    FormUtils.clearMultiSelect(this.alarmsGroup);
    FormUtils.clearMultiSelect(this.tasksGroup);
    FormUtils.clearMultiSelect(this.notesGroup);
    FormUtils.clearMultiSelect(this.bookmarksGroup);
    FormUtils.clearMultiSelect(this.filesGroup);
    FormUtils.clearMultiSelect(this.videosGroup);
    this.reset$.next();
    this.search(true);
  }

  public search(emitSearchStart: boolean): void {
    if (emitSearchStart) {
      this.searchService.startSearch();
    }
    this.catalogsSearchService.searchCatalogs({
      name: this.name.value,
      assignedToDashboard: this.assignedToDashboardControl.value,
      tasks: this.tasksGroup.get(formNames.items).value,
      alarms: this.alarmsGroup.get(formNames.items).value,
      notes: this.notesGroup.get(formNames.items).value,
      bookmarks: this.bookmarksGroup.get(formNames.items).value,
      files: this.filesGroup.get(formNames.items).value,
      videos: this.videosGroup.get(formNames.items).value
    });
    this.emitSearch();
  }

  public ngOnDestroy(): void {
    SearchComponent.searchName = this.name.value;
    SearchComponent.searchAssignedToDashboard = this.assignedToDashboardControl.value;
    SearchComponent.searchTasks = this.tasksGroup.get(formNames.items).value;
    SearchComponent.searchAlarms = this.alarmsGroup.get(formNames.items).value;
    SearchComponent.searchNotes = this.notesGroup.get(formNames.items).value;
    SearchComponent.searchBookmarks = this.bookmarksGroup.get(formNames.items).value;
    SearchComponent.searchFiles = this.filesGroup.get(formNames.items).value;
    SearchComponent.searchVideos = this.videosGroup.get(formNames.items).value;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private isUpdated(): boolean {
    return this.name.value !== '' ||
      this.assignedToDashboardControl.value !== null ||
      this.tasksGroup.get(formNames.items).value.length > 0 ||
      this.alarmsGroup.get(formNames.items).value.length > 0 ||
      this.notesGroup.get(formNames.items).value.length > 0 ||
      this.bookmarksGroup.get(formNames.items).value.length > 0 ||
      this.filesGroup.get(formNames.items).value.length > 0 ||
      this.videosGroup.get(formNames.items).value.length > 0;
  }

  private emitSearch(): void {
    setTimeout(() => this.searchService.updateSearch(this.isUpdated()), 100);
  }
}
