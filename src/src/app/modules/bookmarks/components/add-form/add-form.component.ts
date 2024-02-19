import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormUtils} from '../../../../core/utils/form.utils';
import {ColorUtils} from '../../../../core/utils/color.utils';
import {
  basicBackgroundColor,
  basicTextColor,
  BookmarksFormNames,
  FormFactory,
  formNames
} from '../../../../core/factories/bookmark.factory';
import {bookmarkAdd} from '../../../../core/store/bookmarks/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/bookmarks/reducers';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';

@Component({
  selector: 'bookmarks-add-form',
  templateUrl: './add-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFormComponent implements OnInit {

  public formNames: BookmarksFormNames;
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
    this.store.dispatch(bookmarkAdd({bookmark: FormUtils.createBookmarkRequest(this.form, this.formNames, false)}));
    if (close) {
      this.formSubmitted.emit();
    }
    this.clearForm();
  }

  private clearForm(): void {
    FormUtils.clearPinned(this.form);
    FormUtils.clearInputs(this.form, '', this.formNames.name, this.formNames.href);
    FormUtils.clearInputs(this.form, ColorUtils.hexToColor(basicBackgroundColor), this.formNames.backgroundColor);
    FormUtils.clearInputs(this.form, ColorUtils.hexToColor(basicTextColor), this.formNames.textColor);
    FormUtils.clearInputs(this.form, false, this.formNames.assignedToDashboard);
    this.reset$.next();
  }
}
