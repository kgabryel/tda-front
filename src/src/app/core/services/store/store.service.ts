import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {State as AlarmsState} from '../../store/alarms/reducers';
import {State as BookmarksState} from '../../store/bookmarks/reducers';
import {State as CatalogsState} from '../../store/catalogs/reducers';
import {State as ColorsState} from '../../store/colors/reducers';
import {State as FilesState} from '../../store/files/reducers';
import {State as NotesState} from '../../store/notes/reducers';
import {State as NotificationsTypesState} from '../../store/notifications-types/reducers';
import {State as SettingsState} from '../../store/settings/reducers';
import {State as TasksState} from '../../store/tasks/reducers';
import {State as TasksStatusesState} from '../../store/tasks-statuses/reducers';
import {State as VideosState} from '../../store/videos/reducers';
import {alarmsReset} from '../../store/alarms/actions';
import {bookmarksReset} from '../../store/bookmarks/actions';
import {catalogsReset} from '../../store/catalogs/actions';
import {colorsReset} from '../../store/colors/actions';
import {filesReset} from '../../store/files/actions';
import {notesReset} from '../../store/notes/actions';
import {notificationTypesReset} from '../../store/notifications-types/actions';
import {settingsReset} from '../../store/settings/actions';
import {tasksReset} from '../../store/tasks/actions';
import {taskStatusReset} from '../../store/tasks-statuses/actions';
import {videosReset} from '../../store/videos/actions';

@Injectable()
export class StoreService {
  private alarmsStore: Store<AlarmsState>;
  private bookmarksStore: Store<BookmarksState>;
  private catalogsStore: Store<CatalogsState>;
  private colorsStore: Store<ColorsState>;
  private filesStore: Store<FilesState>;
  private notesStore: Store<NotesState>;
  private notificationsTypesStore: Store<NotificationsTypesState>;
  private settingsStore: Store<SettingsState>;
  private tasksStore: Store<TasksState>;
  private tasksStatusesStore: Store<TasksStatusesState>;
  private videosStore: Store<VideosState>;

  constructor(
    alarmsStore: Store<AlarmsState>,
    bookmarksStore: Store<BookmarksState>,
    catalogsStore: Store<CatalogsState>,
    colorsStore: Store<ColorsState>,
    filesStore: Store<FilesState>,
    notesStore: Store<NotesState>,
    notificationsTypesStore: Store<NotificationsTypesState>,
    settingsStore: Store<SettingsState>,
    tasksStore: Store<TasksState>,
    tasksStatusesStore: Store<TasksStatusesState>,
    videosStore: Store<VideosState>
  ) {
    this.alarmsStore = alarmsStore;
    this.bookmarksStore = bookmarksStore;
    this.catalogsStore = catalogsStore;
    this.colorsStore = colorsStore;
    this.filesStore = filesStore;
    this.notesStore = notesStore;
    this.notificationsTypesStore = notificationsTypesStore;
    this.settingsStore = settingsStore;
    this.tasksStore = tasksStore;
    this.tasksStatusesStore = tasksStatusesStore;
    this.videosStore = videosStore;
  }

  public clearStores(): void {
    this.alarmsStore.dispatch(alarmsReset());
    this.bookmarksStore.dispatch(bookmarksReset());
    this.catalogsStore.dispatch(catalogsReset());
    this.colorsStore.dispatch(colorsReset());
    this.filesStore.dispatch(filesReset());
    this.notesStore.dispatch(notesReset());
    this.notificationsTypesStore.dispatch(notificationTypesReset());
    this.settingsStore.dispatch(settingsReset());
    this.tasksStore.dispatch(tasksReset());
    this.tasksStatusesStore.dispatch(taskStatusReset());
    this.videosStore.dispatch(videosReset());
  }
}
