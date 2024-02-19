import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContentComponent} from './components/content/content.component';
import {PaginationComponent} from './components/pagination/pagination.component';
import {PeriodicNotificationsComponent} from './components/periodic-notifications/periodic-notifications.component';
import {SingleAlarmPartComponent} from './components/single-alarm-part/single-alarm-part.component';
import {SingleNotificationsComponent} from './components/single-notifications/single-notifications.component';
import {TaskSheetComponent} from './components/task-sheet/task-sheet.component';
import {NameComponent} from './components/name/name.component';
import {EditorModule} from 'primeng/editor';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatInputModule} from '@angular/material/input';
import {FormModule} from '../form/form.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxMatDatetimePickerModule} from '@angular-material-components/datetime-picker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {PipesModule} from '../pipes/pipes.module';
import {PeriodicNotificationComponent} from './components/periodic-notification/periodic-notification.component';

@NgModule({
  declarations: [
    ContentComponent,
    PaginationComponent,
    PeriodicNotificationsComponent,
    SingleAlarmPartComponent,
    SingleNotificationsComponent,
    TaskSheetComponent,
    NameComponent,
    PeriodicNotificationComponent
  ],
  exports: [
    ContentComponent,
    PaginationComponent,
    SingleAlarmPartComponent,
    SingleNotificationsComponent,
    NameComponent,
    PeriodicNotificationsComponent
  ],
  imports: [
    CommonModule,
    EditorModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatInputModule,
    FormModule,
    DragDropModule,
    NgxMatDatetimePickerModule,
    MatAutocompleteModule,
    PipesModule
  ]
})
export class TasksAlarmsSharedModule {
}
