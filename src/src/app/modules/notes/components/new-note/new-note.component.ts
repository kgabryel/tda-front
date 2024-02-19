import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SidenavService} from '../../../../core/services/sidenav/sidenav.service';
import {Note} from '../../../../core/models/note';

@Component({
  selector: 'notes-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewNoteComponent implements OnInit {

  private sidenavService: SidenavService<Note>;

  public constructor(sidenavService: SidenavService<Note>) {
    this.sidenavService = sidenavService;
  }

  public ngOnInit(): void {
    this.sidenavService.changeStatus({
      open: false,
      model: null
    });
  }

  public showSidenav(): void {
    this.sidenavService.changeStatus({
      open: true,
      model: null
    });
  }
}
