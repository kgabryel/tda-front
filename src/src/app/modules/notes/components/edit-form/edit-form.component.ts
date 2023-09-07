import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Note} from '../../../../core/models/note';
import {FormFactory, formNames, NotesFormNames} from '../../../../core/factories/note.factory';
import {noteUpdate} from '../../../../core/store/notes/actions';
import {FormUtils} from '../../../../core/utils/form.utils';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/notes/reducers';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'notes-edit-form',
  templateUrl: './edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditFormComponent implements OnInit {

  @Input() public note: Note;
  public formNames: NotesFormNames;
  public form: FormGroup;
  @Output() private formSubmitted: EventEmitter<void>;
  private readonly store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
    this.formNames = formNames;
    this.formSubmitted = new EventEmitter<void>();
  }

  public ngOnInit(): void {
    this.form = FormFactory.getEditForm(this.note);
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(noteUpdate({
      id: this.note.id,
      note: FormUtils.createNoteRequest(this.form, this.formNames)
    }));
    this.formSubmitted.emit();
  }
}
