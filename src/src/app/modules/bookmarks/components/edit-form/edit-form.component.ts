import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Bookmark} from '../../../../core/models/bookmark';
import {BookmarksFormNames, FormFactory, formNames} from '../../../../core/factories/bookmark.factory';
import {FormUtils} from '../../../../core/utils/form.utils';
import {bookmarkUpdate} from '../../../../core/store/bookmarks/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/bookmarks/reducers';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'bookmarks-edit-form',
  templateUrl: './edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditFormComponent implements OnInit {

  @Input() public bookmark: Bookmark;
  public formNames: BookmarksFormNames;
  public form: FormGroup;
  @Output() private formSubmitted: EventEmitter<void>;
  private readonly store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
    this.formNames = formNames;
    this.formSubmitted = new EventEmitter<void>();
  }

  public ngOnInit(): void {
    this.form = FormFactory.getEditForm(this.bookmark);
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(bookmarkUpdate({
      id: this.bookmark.id, bookmark:
        FormUtils.createBookmarkRequest(this.form, this.formNames, true)
    }));
    this.formSubmitted.emit();
  }
}
