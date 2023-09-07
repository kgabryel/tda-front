import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {File} from '../../../../core/models/file';
import {FilesService} from '../../../../core/services/files/files.service';
import {PinnedSidenavService, Type} from '../../../../core/services/pinned-sidenav/pinned-sidenav.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {filter} from 'rxjs/operators';
import {fileDelete} from '../../../../core/store/files/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/files/reducers';
import {SidenavService} from '../../../../core/services/sidenav/sidenav.service';

@Component({
  selector: 'files-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsComponent {

  @Input() public file: File;
  private store: Store<State>;
  private filesService: FilesService;
  private sidenavService: SidenavService<File>;
  private pinnedSidenavService: PinnedSidenavService;
  private deleteSheet: MatBottomSheet;

  public constructor(
    store: Store<State>,
    filesService: FilesService,
    sidenavService: SidenavService<File>,
    pinnedSidenavService: PinnedSidenavService,
    deleteSheet: MatBottomSheet
  ) {
    this.store = store;
    this.filesService = filesService;
    this.sidenavService = sidenavService;
    this.pinnedSidenavService = pinnedSidenavService;
    this.deleteSheet = deleteSheet;
  }

  public download(): void {
    this.filesService.download(this.file.id, this.file.originalName, this.file.extension);
  }

  public delete(): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.store.dispatch(fileDelete({id: this.file.id})));
  }

  public edit(): void {
    this.sidenavService.changeStatus({
      open: true,
      model: this.file
    });
  }

  public showTasks(): void {
    this.pinnedSidenavService.changeStatus({
      open: true,
      tasks: this.file.tasks,
      catalogs: [],
      type: Type.tasks
    });
  }

  public showCatalogs(): void {
    this.pinnedSidenavService.changeStatus({
      open: true,
      tasks: [],
      catalogs: this.file.catalogs,
      type: Type.catalogs
    });
  }
}
