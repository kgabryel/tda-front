import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../../../../core/models/note';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/notes/reducers';
import {selectNote} from '../../../../core/store/notes/selectors';

@Component({
  selector: 'notes-note-view',
  templateUrl: './note-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteViewComponent implements OnInit {

  @Input() public id: number;
  public note$: Observable<Note>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public ngOnInit(): void {
    this.note$ = this.store.select(selectNote(this.id));
  }

}
