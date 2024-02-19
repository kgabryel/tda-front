import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {CreateComponent} from './pages/create/create.component';
import {AlarmsRoutingModule} from './alarms-routing.module';
import {FormComponent as SingleFormComponent} from './components/single-form/form/form.component';
import {FormComponent as PeriodicFormComponent} from './components/periodic-form/form/form.component';
import {MatTabsModule} from '@angular/material/tabs';
import {
  SmallFormComponent as PeriodicSmallFormComponent
} from './components/periodic-form/small-form/small-form.component';
import {BigFormComponent as PeriodicBigFormComponent} from './components/periodic-form/big-form/big-form.component';
import {SmallFormComponent as SingleSmallFormComponent} from './components/single-form/small-form/small-form.component';
import {BigFormComponent as SingleBigFormComponent} from './components/single-form/big-form/big-form.component';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormNotificationService} from '../../core/services/form-notification/form-notification.service';
import {NotificationTypesService} from '../../core/services/notification-types/notification-types.service';
import {MatSelectModule} from '@angular/material/select';
import {AlarmSingleComponent} from './components/alarm-single/alarm-single.component';
import {AlarmPeriodicComponent} from './components/alarm-periodic/alarm-periodic.component';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {ContentPartComponent} from './components/periodic-form/content-part/content-part.component';
import {MainPartComponent as PeriodicMainPartComponent} from './components/periodic-form/main-part/main-part.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {TranslateModule} from '@ngx-translate/core';
import {NotificationTypesResolver} from '../../core/resolvers/notification-types.resolver';
import {DeactivateAlarmComponent} from './pages/deactivate-alarm/deactivate-alarm.component';
import {AlarmComponent} from './pages/alarm/alarm.component';
import {AddNotificationComponent} from './components/add-notification/add-notification.component';
import {MainComponent} from './components/main/main.component';
import {NgxMatDatetimePickerModule} from '@angular-material-components/datetime-picker';
import {AlarmPreviewComponent} from './components/alarm-preview/alarm-preview.component';
import {AddSecondsPipe} from './pipes/add-seconds/add-seconds.pipe';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {TaskSheetComponent} from './components/task-sheet/task-sheet.component';
import {SearchComponent} from './components/search/search.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {StoreModule} from '@ngrx/store';
import {key as typesKey, reducer as typesReducer} from '../../core/store/notifications-types/reducers';
import {EffectsModule} from '@ngrx/effects';
import {NotificationsTypesEffects} from '../../core/store/notifications-types/effects';
import {ChipsModule} from 'primeng/chips';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AlarmCatalogsService} from '../../core/services/alarm-catalogs/alarm-catalogs.service';
import {CatalogsComponent} from './components/catalogs/catalogs.component';
import {MatListModule} from '@angular/material/list';
import {SimpleViewModule} from '../simple-view/simple-view.module';
import {NotificationTypesContainer} from '../../core/containers/notification-types.container';
import {FormModule} from '../form/form.module';
import {SharedModule} from '../shared/shared.module';
import {TasksAlarmsSharedModule} from '../tasks-alarms-shared/tasks-alarms-shared.module';
import {PipesModule} from '../pipes/pipes.module';
import {ActionsComponent} from './components/actions/actions.component';
import {TaskSingleComponent} from './components/task-single/task-single.component';
import {NotificationComponent} from './components/notification/notification.component';
import {EditorModule} from 'primeng/editor';
import {NotificationsComponent} from './components/notifications/notifications.component';
import {AlarmsComponent} from './components/alarms/alarms.component';
import {
  ActivatePeriodicAlarmSheetComponent
} from './components/activate-periodic-alarm-sheet/activate-periodic-alarm-sheet.component';
import {
  DeactivatePeriodicAlarmSheetComponent
} from './components/deactivate-periodic-alarm-sheet/deactivate-periodic-alarm-sheet.component';
import {AlarmsFilterComponent} from './components/alarms-filter/alarms-filter.component';
import {NotificationsGroupsComponent} from './components/notifications-groups/notifications-groups.component';
import {NotificationGroupComponent} from './components/notification-group/notification-group.component';
import {AddNotificationGroupComponent} from './components/add-notification-group/add-notification-group.component';
import {AlarmViewComponent} from './components/alarm-view/alarm-view.component';

@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    SingleFormComponent,
    PeriodicFormComponent,
    PeriodicSmallFormComponent,
    PeriodicBigFormComponent,
    SingleSmallFormComponent,
    SingleBigFormComponent,
    AlarmSingleComponent,
    AlarmPeriodicComponent,
    ContentPartComponent,
    PeriodicMainPartComponent,
    DeactivateAlarmComponent,
    AlarmComponent,
    AddNotificationComponent,
    MainComponent,
    AlarmPreviewComponent,
    AddSecondsPipe,
    TaskSheetComponent,
    SearchComponent,
    SidenavComponent,
    CatalogsComponent,
    ActionsComponent,
    TaskSingleComponent,
    NotificationComponent,
    NotificationsComponent,
    AlarmsComponent,
    ActivatePeriodicAlarmSheetComponent,
    DeactivatePeriodicAlarmSheetComponent,
    AlarmsFilterComponent,
    NotificationsGroupsComponent,
    NotificationGroupComponent,
    AddNotificationGroupComponent,
    AlarmViewComponent
  ],
  imports: [
    StoreModule.forFeature(typesKey, typesReducer),
    EffectsModule.forFeature([NotificationsTypesEffects]),
    CommonModule,
    AlarmsRoutingModule,
    MatTabsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatStepperModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatDatepickerModule,
    TranslateModule,
    FormsModule,
    NgxMatDatetimePickerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    ChipsModule,
    NgxPaginationModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatListModule,
    SimpleViewModule,
    FormModule,
    SharedModule,
    TasksAlarmsSharedModule,
    PipesModule,
    EditorModule
  ],
  providers: [
    {provide: 'singleFormNotificationService', useClass: FormNotificationService},
    {provide: 'periodicFormNotificationService', useClass: FormNotificationService},
    NotificationTypesService,
    NotificationTypesResolver,
    AlarmCatalogsService,
    NotificationTypesContainer
  ]
})
export class AlarmsModule {
}
