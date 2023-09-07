import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {NotesRoutingModule} from './notes-routing.module';
import {NewNoteComponent} from './components/new-note/new-note.component';
import {AddFormComponent} from './components/add-form/add-form.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {key as notesKey, reducer as notesReducer} from '../../core/store/notes/reducers';
import {key as colorsKey, reducer as colorsReducer} from '../../core/store/colors/reducers';
import {NotesService} from '../../core/services/notes/notes.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {EditFormComponent} from './components/edit-form/edit-form.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ResizerService} from '../../core/services/resizer/resizer.service';
import {FormComponent} from './components/form/form.component';
import {TranslateModule} from '@ngx-translate/core';
import {NotesResolver} from '../../core/resolvers/notes.resolver';
import {NotesEffects} from '../../core/store/notes/effects';
import {ColorsResolver} from '../../core/resolvers/colors.resolver';
import {ColorsEffects} from '../../core/store/colors/effects';
import {ColorsService} from '../../core/services/colors/colors.service';
import {PinnedSidenavService} from '../../core/services/pinned-sidenav/pinned-sidenav.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {EditorModule} from 'primeng/editor';
import {SearchComponent} from './components/search/search.component';
import {MatSelectModule} from '@angular/material/select';
import {FormModule} from '../form/form.module';
import {SharedModule} from '../shared/shared.module';
import {NoteComponent} from './components/note/note.component';
import {PipesModule} from '../pipes/pipes.module';
import {NoteComponent as NotePageComponent} from './pages/note/note.component';
import {ActionsComponent} from './components/actions/actions.component';
import {QuillModule} from 'ngx-quill';
import {NoteViewComponent} from './components/note-view/note-view.component';

@NgModule({
  declarations: [
    IndexComponent,
    NewNoteComponent,
    AddFormComponent,
    SidenavComponent,
    EditFormComponent,
    FormComponent,
    SearchComponent,
    NoteComponent,
    NotePageComponent,
    ActionsComponent,
    NoteViewComponent
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    StoreModule.forFeature(notesKey, notesReducer),
    StoreModule.forFeature(colorsKey, colorsReducer),
    EffectsModule.forFeature([NotesEffects, ColorsEffects]),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    TranslateModule,
    MatTooltipModule,
    EditorModule,
    FormsModule,
    MatSelectModule,
    FormModule,
    SharedModule,
    PipesModule,
    QuillModule
  ],
  providers: [
    NotesService,
    ResizerService,
    NotesResolver,
    ColorsResolver,
    ColorsService,
    PinnedSidenavService
  ]
})
export class NotesModule {
}
