import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {LangComponent} from './components/lang/lang.component';
import {LoaderComponent} from './components/loader/loader.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxMatDatetimePickerModule} from '@angular-material-components/datetime-picker';
import {MatSelectModule} from '@angular/material/select';
import {DeleteSheetComponent} from './components/delete-sheet/delete-sheet.component';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PinnedTasksComponent} from './components/pinned-tasks/pinned-tasks.component';
import {PinnedCatalogsComponent} from './components/pinned-catalogs/pinned-catalogs.component';
import {RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {EditorModule} from 'primeng/editor';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormModule} from '../form/form.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {PipesModule} from '../pipes/pipes.module';
import {DialogHeaderComponent} from './components/dialog-header/dialog-header.component';
import {SimpleViewModule} from '../simple-view/simple-view.module';

@NgModule({
  declarations: [
    LangComponent,
    LoaderComponent,
    DeleteSheetComponent,
    PinnedTasksComponent,
    PinnedCatalogsComponent,
    DialogHeaderComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatChipsModule,
    TranslateModule,
    FormsModule,
    DragDropModule,
    NgxMatDatetimePickerModule,
    MatSelectModule,
    MatListModule,
    MatTooltipModule,
    RouterModule,
    MatDialogModule,
    EditorModule,
    MatCardModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDatepickerModule,
    NgxPaginationModule,
    FormModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    PipesModule,
    SimpleViewModule
  ],
  exports: [
    LangComponent,
    LoaderComponent,
    PinnedCatalogsComponent,
    PinnedTasksComponent,
    DialogHeaderComponent
  ]
})
export class SharedModule {
}
