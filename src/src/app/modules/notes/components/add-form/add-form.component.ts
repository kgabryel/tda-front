import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  basicBackgroundColor,
  basicTextColor,
  FormFactory,
  formNames,
  NotesFormNames
} from '../../../../core/factories/note.factory';
import {noteAdd} from '../../../../core/store/notes/actions';
import {FormUtils} from '../../../../core/utils/form.utils';
import {ColorUtils} from '../../../../core/utils/color.utils';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/notes/reducers';

@Component({
  selector: 'notes-add-form',
  templateUrl: './add-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFormComponent implements OnInit {

  public formNames: NotesFormNames;
  public form: FormGroup;
  public reset$: Subject<void>;
  @Output() private formSubmitted: EventEmitter<void>;
  private readonly store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
    this.formNames = formNames;
    this.formSubmitted = new EventEmitter<void>();
    this.reset$ = new Subject<void>();
  }

  public ngOnInit(): void {
    this.form = FormFactory.getCreateForm();
  }

  public submit(close: boolean = true): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(noteAdd({note: FormUtils.createNoteRequest(this.form, this.formNames)}));
    if (close) {
      this.formSubmitted.emit();
    }
    this.clearForm();
  }

  public clearForm(): void {
    FormUtils.clearPinned(this.form);
    FormUtils.clearInputs(this.form, '', this.formNames.name, this.formNames.content);
    FormUtils.clearInputs(this.form, ColorUtils.hexToColor(basicBackgroundColor), this.formNames.backgroundColor);
    FormUtils.clearInputs(this.form, ColorUtils.hexToColor(basicTextColor), this.formNames.textColor);
    FormUtils.clearInputs(this.form, false, this.formNames.assignedToDashboard);
    this.reset$.next();
  }
}
