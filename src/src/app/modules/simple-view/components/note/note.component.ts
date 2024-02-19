import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Note} from '../../../../core/models/note';

@Component({
  selector: 'simple-view-note',
  templateUrl: './note.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent {

  @Input() public note: Note;
  @Input() public delete: boolean = true;
  @Output() private undo: EventEmitter<number>;

  public constructor() {
    this.undo = new EventEmitter<number>();
  }

  public remove(): void {
    this.undo.emit(this.note.id);
  }
}
