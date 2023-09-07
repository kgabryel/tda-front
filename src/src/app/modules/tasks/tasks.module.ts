import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {CreateComponent} from './pages/create/create.component';
import {TasksRoutingModule} from './tasks-routing.module';
import {FormComponent as PeriodicFormComponent} from './components/periodic-form/form/form.component';
import {FormComponent as SingleFormComponent} from './components/single-form/form/form.component';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {FormNotificationService} from '../../core/services/form-notification/form-notification.service';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {TaskPartComponent as SingleTaskPartComponent} from './components/single-form/task-part/task-part.component';
import {TaskPartComponent as PeriodicTaskPartComponent} from './components/periodic-form/task-part/task-part.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {TranslateModule} from '@ngx-translate/core';
import {ToDoComponent} from './pages/to-do/to-do.component';
import {TaskComponent} from './pages/task/task.component';
import {TasksListComponent} from './components/tasks-list/tasks-list.component';
import {MainComponent} from './components/main/main.component';
import {EditDateSheetComponent} from './components/edit-date-sheet/edit-date-sheet.component';
import {NotificationTypesResolver} from '../../core/resolvers/notification-types.resolver';
import {EditorModule} from 'primeng/editor';
import {SearchComponent} from './components/search/search.component';
import {StoreModule} from '@ngrx/store';
import {key as typesKey, reducer as typesReducer} from '../../core/store/notifications-types/reducers';
import {EffectsModule} from '@ngrx/effects';
import {NotificationsTypesEffects} from '../../core/store/notifications-types/effects';
import {NgxPaginationModule} from 'ngx-pagination';
import {PinnedPartComponent} from './components/pinned-part/pinned-part.component';
import {key as videosKey, reducer as videosReducer} from '../../core/store/videos/reducers';
import {key as filesKey, reducer as filesReducer} from '../../core/store/files/reducers';
import {key as notesKey, reducer as notesReducer} from '../../core/store/notes/reducers';
import {key as bookmarksKey, reducer as bookmarksReducer} from '../../core/store/bookmarks/reducers';
import {VideosEffects} from '../../core/store/videos/effects';
import {FilesEffects} from '../../core/store/files/effects';
import {NotesEffects} from '../../core/store/notes/effects';
import {BookmarksEffects} from '../../core/store/bookmarks/effects';
import {NotesService} from '../../core/services/notes/notes.service';
import {NotesResolver} from '../../core/resolvers/notes.resolver';
import {BookmarksService} from '../../core/services/bookmarks/bookmarks.service';
import {BookmarksResolver} from '../../core/resolvers/bookmarks.resolver';
import {FilesService} from '../../core/services/files/files.service';
import {FilesResolver} from '../../core/resolvers/files.resolver';
import {VideosService} from '../../core/services/videos/videos.service';
import {VideosResolver} from '../../core/resolvers/videos.resolver';
import {UploadFileService} from '../../core/services/upload-file/upload-file.service';
import {MatDialogModule} from '@angular/material/dialog';
import {TasksStatusesEffects} from '../../core/store/tasks-statuses/effects';
import {CatalogsComponent} from './components/catalogs/catalogs.component';
import {NotesComponent} from './components/notes/notes.component';
import {FilesComponent} from './components/files/files.component';
import {BookmarksComponent} from './components/bookmarks/bookmarks.component';
import {VideosComponent} from './components/videos/videos.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {TaskPinnedService} from '../../core/services/task-pinned/task-pinned.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SimpleViewModule} from '../simple-view/simple-view.module';
import {NotificationTypesService} from '../../core/services/notification-types/notification-types.service';
import {NotificationTypesContainer} from '../../core/containers/notification-types.container';
import {FormModule} from '../form/form.module';
import {SharedModule} from '../shared/shared.module';
import {TaskSingleComponent} from './components/task-single/task-single.component';
import {TaskPeriodicComponent} from './components/task-periodic/task-periodic.component';
import {AddSubtaskComponent} from './components/add-subtask/add-subtask.component';
import {SubtaskComponent} from './components/subtask/subtask.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {DateComponent} from './components/date/date.component';
import {AlarmSheetComponent} from './components/alarm-sheet/alarm-sheet.component';
import {StatusSheetComponent} from './components/status-sheet/status-sheet.component';
import {TasksAlarmsSharedModule} from '../tasks-alarms-shared/tasks-alarms-shared.module';
import {PipesModule} from '../pipes/pipes.module';
import {ActionsComponent} from './components/actions/actions.component';
import {AlarmSingleComponent} from './components/alarm-single/alarm-single.component';
import {TasksComponent} from './components/tasks/tasks.component';
import {
  ActivatePeriodicTaskSheetComponent
} from './components/activate-periodic-task-sheet/activate-periodic-task-sheet.component';
import {
  DeactivatePeriodicTaskSheetComponent
} from './components/deactivate-periodic-task-sheet/deactivate-periodic-task-sheet.component';
import {
  DeleteWithConnectedSheetComponent
} from './components/delete-with-connected-sheet/delete-with-connected-sheet.component';
import {ConditionSheetComponent} from './components/condition-sheet/condition-sheet.component';
import {TasksFilterComponent} from './components/tasks-filter/tasks-filter.component';
import {TaskViewComponent} from './components/task-view/task-view.component';

@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    PeriodicFormComponent,
    SingleFormComponent,
    SingleTaskPartComponent,
    PeriodicTaskPartComponent,
    ToDoComponent,
    TaskComponent,
    TasksListComponent,
    MainComponent,
    EditDateSheetComponent,
    SearchComponent,
    PinnedPartComponent,
    CatalogsComponent,
    NotesComponent,
    FilesComponent,
    BookmarksComponent,
    VideosComponent,
    SidenavComponent,
    TaskSingleComponent,
    TaskPeriodicComponent,
    AddSubtaskComponent,
    SubtaskComponent,
    DateComponent,
    AlarmSheetComponent,
    StatusSheetComponent,
    ActionsComponent,
    AlarmSingleComponent,
    TasksComponent,
    ActivatePeriodicTaskSheetComponent,
    DeactivatePeriodicTaskSheetComponent,
    DeleteWithConnectedSheetComponent,
    ConditionSheetComponent,
    TasksFilterComponent,
    TaskViewComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatExpansionModule,
    MatCardModule,
    MatListModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    TranslateModule,
    FormsModule,
    EditorModule,
    StoreModule.forFeature(typesKey, typesReducer),
    StoreModule.forFeature(videosKey, videosReducer),
    StoreModule.forFeature(filesKey, filesReducer),
    StoreModule.forFeature(notesKey, notesReducer),
    StoreModule.forFeature(bookmarksKey, bookmarksReducer),
    EffectsModule.forFeature([
      TasksStatusesEffects,
      NotificationsTypesEffects,
      VideosEffects,
      FilesEffects,
      NotesEffects,
      BookmarksEffects]),
    NgxPaginationModule,
    MatDialogModule,
    MatSidenavModule,
    MatTooltipModule,
    SimpleViewModule,
    FormModule,
    SharedModule,
    MatButtonToggleModule,
    TasksAlarmsSharedModule,
    PipesModule
  ],
  providers: [
    {provide: 'singleFormNotificationService', useClass: FormNotificationService},
    {provide: 'periodicFormNotificationService', useClass: FormNotificationService},
    NotificationTypesResolver,
    NotesService,
    NotesResolver,
    BookmarksService,
    BookmarksResolver,
    FilesService,
    FilesResolver,
    VideosService,
    VideosResolver,
    UploadFileService,
    TaskPinnedService,
    NotificationTypesService,
    NotificationTypesContainer
  ]
})
export class TasksModule {
}
