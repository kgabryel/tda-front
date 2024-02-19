import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {PinnedItemsComponent} from './components/pinned-items/pinned-items.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {EventParserService} from '../../core/services/event-parser/event-parser.service';
import localePl from '@angular/common/locales/pl';
import localeEn from '@angular/common/locales/en';
import {TranslateModule} from '@ngx-translate/core';
import {NotesResolver} from '../../core/resolvers/notes.resolver';
import {BookmarksResolver} from '../../core/resolvers/bookmarks.resolver';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {NotesService} from '../../core/services/notes/notes.service';
import {BookmarksService} from '../../core/services/bookmarks/bookmarks.service';
import {key as notesKey, reducer as notesReducer} from '../../core/store/notes/reducers';
import {key as bookmarksKey, reducer as bookmarksReducer} from '../../core/store/bookmarks/reducers';
import {key as filesKey, reducer as filesReducer} from '../../core/store/files/reducers';
import {key as videosKey, reducer as videosReducer} from '../../core/store/videos/reducers';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {NotesEffects} from '../../core/store/notes/effects';
import {BookmarksEffects} from '../../core/store/bookmarks/effects';
import {FilesEffects} from '../../core/store/files/effects';
import {VideosEffects} from '../../core/store/videos/effects';
import {FilesResolver} from '../../core/resolvers/files.resolver';
import {FilesService} from '../../core/services/files/files.service';
import {VideosResolver} from '../../core/resolvers/videos.resolver';
import {VideosService} from '../../core/services/videos/videos.service';
import {UploadFileService} from '../../core/services/upload-file/upload-file.service';
import {PinnedSidenavService} from '../../core/services/pinned-sidenav/pinned-sidenav.service';
import {SimpleViewModule} from '../simple-view/simple-view.module';
import {MatIconModule} from '@angular/material/icon';

registerLocaleData(localePl);
registerLocaleData(localeEn);

@NgModule({
  declarations: [IndexComponent, CalendarComponent, PinnedItemsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    StoreModule.forFeature(notesKey, notesReducer),
    StoreModule.forFeature(bookmarksKey, bookmarksReducer),
    StoreModule.forFeature(filesKey, filesReducer),
    StoreModule.forFeature(videosKey, videosReducer),
    EffectsModule.forFeature([NotesEffects, BookmarksEffects, FilesEffects, VideosEffects]),
    MatExpansionModule,
    TranslateModule,
    MatButtonToggleModule,
    SimpleViewModule,
    MatIconModule
  ],
  providers: [
    EventParserService,
    NotesResolver,
    NotesService,
    BookmarksResolver,
    BookmarksService,
    FilesResolver,
    FilesService,
    VideosResolver,
    VideosService,
    UploadFileService,
    PinnedSidenavService
  ]
})
export class DashboardModule {
}
