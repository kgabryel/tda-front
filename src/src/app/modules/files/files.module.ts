import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {AddFormComponent} from './components/add-form/add-form.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {FilesTableComponent} from './components/files-table/files-table.component';
import {FilesRoutingModule} from './files-routing.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgxMatFileInputModule} from '@angular-material-components/file-input';
import {StoreModule} from '@ngrx/store';
import {key as filesKey, reducer as filesReducer} from '../../core/store/files/reducers';
import {EffectsModule} from '@ngrx/effects';
import {FilesEffects} from '../../core/store/files/effects';
import {FilesService} from '../../core/services/files/files.service';
import {FilesResolver} from '../../core/resolvers/files.resolver';
import {TableModule} from 'primeng/table';
import {MatCardModule} from '@angular/material/card';
import {FileSaverModule} from 'ngx-filesaver';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AddButtonComponent} from './components/add-button/add-button.component';
import {EditFormComponent} from './components/edit-form/edit-form.component';
import {MatStepperModule} from '@angular/material/stepper';
import {PinnedSidenavService} from '../../core/services/pinned-sidenav/pinned-sidenav.service';
import {UploadFileService} from '../../core/services/upload-file/upload-file.service';
import {MatDialogModule} from '@angular/material/dialog';
import {UploadProgressOverlayComponent} from './components/upload-progress-overlay/upload-progress-overlay.component';
import {MatMenuModule} from '@angular/material/menu';
import {FileSizeBarComponent} from './components/file-size-bar/file-size-bar.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {SearchComponent} from './components/search/search.component';
import {FormModule} from '../form/form.module';
import {SharedModule} from '../shared/shared.module';
import {PipesModule} from '../pipes/pipes.module';
import {SimpleViewModule} from '../simple-view/simple-view.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ActionsComponent} from './components/actions/actions.component';

@NgModule({
  declarations: [
    IndexComponent,
    AddFormComponent,
    SidenavComponent,
    FilesTableComponent,
    AddButtonComponent,
    EditFormComponent,
    UploadProgressOverlayComponent,
    FileSizeBarComponent,
    SearchComponent,
    ActionsComponent
  ],
  imports: [
    CommonModule,
    FilesRoutingModule,
    MatSidenavModule,
    MatTableModule,
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatFileInputModule,
    StoreModule.forFeature(filesKey, filesReducer),
    EffectsModule.forFeature([FilesEffects]),
    TableModule,
    MatCardModule,
    FileSaverModule,
    MatIconModule,
    MatTooltipModule,
    MatStepperModule,
    MatDialogModule,
    MatMenuModule,
    MatSlideToggleModule,
    FormsModule,
    FormModule,
    SharedModule,
    PipesModule,
    SimpleViewModule,
    MatProgressBarModule
  ],
  providers: [
    FilesService,
    FilesResolver,
    PinnedSidenavService,
    UploadFileService
  ]
})
export class FilesModule {
}
