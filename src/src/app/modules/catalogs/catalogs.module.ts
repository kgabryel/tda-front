import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {CatalogsRoutingModule} from './catalogs-routing.module';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {AddFormComponent} from './components/add-form/add-form.component';
import {AddButtonComponent} from './components/add-button/add-button.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {StoreModule} from '@ngrx/store';
import {key as videosKey, reducer as videosReducer} from '../../core/store/videos/reducers';
import {key as filesKey, reducer as filesReducer} from '../../core/store/files/reducers';
import {key as notesKey, reducer as notesReducer} from '../../core/store/notes/reducers';
import {key as bookmarksKey, reducer as bookmarksReducer} from '../../core/store/bookmarks/reducers';
import {EffectsModule} from '@ngrx/effects';
import {VideosEffects} from '../../core/store/videos/effects';
import {FilesEffects} from '../../core/store/files/effects';
import {NotesEffects} from '../../core/store/notes/effects';
import {VideosService} from '../../core/services/videos/videos.service';
import {FilesService} from '../../core/services/files/files.service';
import {NotesService} from '../../core/services/notes/notes.service';
import {VideosResolver} from '../../core/resolvers/videos.resolver';
import {FilesResolver} from '../../core/resolvers/files.resolver';
import {NotesResolver} from '../../core/resolvers/notes.resolver';
import {BookmarksEffects} from '../../core/store/bookmarks/effects';
import {BookmarksResolver} from '../../core/resolvers/bookmarks.resolver';
import {BookmarksService} from '../../core/services/bookmarks/bookmarks.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CatalogComponent} from './components/catalog/catalog.component';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {UploadFileService} from '../../core/services/upload-file/upload-file.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SimpleViewModule} from '../simple-view/simple-view.module';
import {SearchComponent} from './components/search/search.component';
import {EditFormComponent} from './components/edit-form/edit-form.component';
import {PinnedSidenavService} from '../../core/services/pinned-sidenav/pinned-sidenav.service';
import {CatalogComponent as CatalogPageComponent} from './pages/catalog/catalog.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {FormModule} from '../form/form.module';
import {SharedModule} from '../shared/shared.module';
import {PipesModule} from '../pipes/pipes.module';
import {FormComponent} from './components/form/form.component';
import {CatalogViewComponent} from './components/catalog-view/catalog-view.component';

@NgModule({
  declarations: [
    IndexComponent,
    SidenavComponent,
    AddFormComponent,
    AddButtonComponent,
    CatalogComponent,
    SearchComponent,
    EditFormComponent,
    CatalogPageComponent,
    FormComponent,
    CatalogViewComponent
  ],
  imports: [
    CommonModule,
    CatalogsRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    StoreModule.forFeature(videosKey, videosReducer),
    StoreModule.forFeature(filesKey, filesReducer),
    StoreModule.forFeature(notesKey, notesReducer),
    StoreModule.forFeature(bookmarksKey, bookmarksReducer),
    EffectsModule.forFeature([VideosEffects, FilesEffects, NotesEffects, BookmarksEffects]),
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    SimpleViewModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    FormModule,
    SharedModule,
    PipesModule
  ],
  providers: [
    VideosService,
    FilesService,
    NotesService,
    VideosResolver,
    FilesResolver,
    NotesResolver,
    BookmarksResolver,
    BookmarksService,
    UploadFileService,
    PinnedSidenavService
  ]
})
export class CatalogsModule {
}
