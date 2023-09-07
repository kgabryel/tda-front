import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {VideosRoutingModule} from './videos-routing.module';
import {StoreModule} from '@ngrx/store';
import {key as videosKey, reducer as videosReducer} from '../../core/store/videos/reducers';
import {EffectsModule} from '@ngrx/effects';
import {VideosEffects} from '../../core/store/videos/effects';
import {AddFormComponent} from './components/add-form/add-form.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {VideosService} from '../../core/services/videos/videos.service';
import {VideosResolver} from '../../core/resolvers/videos.resolver';
import {AddButtonComponent} from './components/add-button/add-button.component';
import {VideoComponent} from './components/video/video.component';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {EditFormComponent} from './components/edit-form/edit-form.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PinnedSidenavService} from '../../core/services/pinned-sidenav/pinned-sidenav.service';
import {SearchComponent} from './components/search/search.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {FormModule} from '../form/form.module';
import {SharedModule} from '../shared/shared.module';
import {PipesModule} from '../pipes/pipes.module';
import {VideoViewComponent} from './components/video-view/video-view.component';

@NgModule({
  declarations: [
    IndexComponent,
    AddFormComponent,
    SidenavComponent,
    AddButtonComponent,
    VideoComponent,
    EditFormComponent,
    SearchComponent,
    VideoViewComponent
  ],
  imports: [
    CommonModule,
    VideosRoutingModule,
    StoreModule.forFeature(videosKey, videosReducer),
    EffectsModule.forFeature([VideosEffects]),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    TranslateModule,
    MatInputModule,
    MatSidenavModule,
    YouTubePlayerModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
    FormModule,
    SharedModule,
    PipesModule
  ],
  providers: [
    VideosService,
    VideosResolver,
    PinnedSidenavService
  ]
})
export class VideosModule {
}
