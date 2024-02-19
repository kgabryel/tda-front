import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {BookmarksRoutingModule} from './bookmarks-routing.module';
import {NewBookmarkComponent} from './components/new-bookmark/new-bookmark.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {AddFormComponent} from './components/add-form/add-form.component';
import {BookmarkContainerComponent} from './components/bookmark-container/bookmark-container.component';
import {BookmarksService} from '../../core/services/bookmarks/bookmarks.service';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {key as bookmarksKey, reducer as bookmarksReducer} from '../../core/store/bookmarks/reducers';
import {key as colorsKey, reducer as colorsReducer} from '../../core/store/colors/reducers';
import {BookmarksEffects} from '../../core/store/bookmarks/effects';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {EditFormComponent} from './components/edit-form/edit-form.component';
import {ResizerService} from '../../core/services/resizer/resizer.service';
import {FormComponent} from './components/form/form.component';
import {TranslateModule} from '@ngx-translate/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {BookmarksResolver} from '../../core/resolvers/bookmarks.resolver';
import {ColorsResolver} from '../../core/resolvers/colors.resolver';
import {ColorsEffects} from '../../core/store/colors/effects';
import {ColorsService} from '../../core/services/colors/colors.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PinnedSidenavService} from '../../core/services/pinned-sidenav/pinned-sidenav.service';
import {BookmarkComponent} from './components/bookmark/bookmark.component';
import {SearchComponent} from './components/search/search.component';
import {MatSelectModule} from '@angular/material/select';
import {FormModule} from '../form/form.module';
import {SharedModule} from '../shared/shared.module';
import {PipesModule} from '../pipes/pipes.module';
import {MatDialogModule} from '@angular/material/dialog';
import {BookmarkViewComponent} from './components/bookmark-view/bookmark-view.component';

@NgModule({
  declarations: [
    IndexComponent,
    NewBookmarkComponent,
    AddFormComponent,
    BookmarkContainerComponent,
    SidenavComponent,
    EditFormComponent,
    FormComponent,
    BookmarkComponent,
    SearchComponent,
    BookmarkViewComponent
  ],
  imports: [
    CommonModule,
    BookmarksRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    StoreModule.forFeature(bookmarksKey, bookmarksReducer),
    StoreModule.forFeature(colorsKey, colorsReducer),
    EffectsModule.forFeature([BookmarksEffects, ColorsEffects]),
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FormsModule,
    MatSelectModule,
    FormModule,
    SharedModule,
    PipesModule,
    MatDialogModule
  ],
  providers: [
    BookmarksService,
    ResizerService,
    BookmarksResolver,
    ColorsResolver,
    ColorsService,
    PinnedSidenavService
  ]
})
export class BookmarksModule {
}
