import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Note} from '../../../../core/models/note';
import {State} from '../../../../core/store/notes/reducers';
import {Store} from '@ngrx/store';
import {noteDelete} from '../../../../core/store/notes/actions';
import {SidenavService} from '../../../../core/services/sidenav/sidenav.service';
import {PinnedSidenavService, Type} from '../../../../core/services/pinned-sidenav/pinned-sidenav.service';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'notes-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {

  @Input() public previewAvailable: boolean = true;
  @Input() public note: Note;
  private store: Store<State>;
  private sidenavService: SidenavService<Note>;
  private pinnedSidenavService: PinnedSidenavService;
  private deleteSheet: MatBottomSheet;

  public constructor(
    pinnedSidenavService: PinnedSidenavService,
    store: Store<State>,
    sidenavService: SidenavService<Note>,
    deleteSheet: MatBottomSheet
  ) {
    this.pinnedSidenavService = pinnedSidenavService;
    this.store = store;
    this.sidenavService = sidenavService;
    this.deleteSheet = deleteSheet;
  }

  public delete(): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.store.dispatch(noteDelete({id: this.note.id})));
  }

  public edit(): void {
    this.sidenavService.changeStatus({
      open: true,
      model: this.note
    });
  }

  public showTasks(): void {
    this.pinnedSidenavService.changeStatus({
      open: true,
      tasks: this.note.tasks,
      catalogs: [],
      type: Type.tasks
    });
  }

  public showCatalogs(): void {
    this.pinnedSidenavService.changeStatus({
      open: true,
      tasks: [],
      catalogs: this.note.catalogs,
      type: Type.catalogs
    });
  }
}
