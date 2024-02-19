import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {FormGroup} from '@angular/forms';
import {CatalogsFormNames, FormFactory, formNames} from '../../../../core/factories/catalog.factory';
import {catalogAdd} from '../../../../core/store/catalogs/actions';
import {FormUtils} from '../../../../core/utils/form.utils';

@Component({
  selector: 'catalogs-add-form',
  templateUrl: './add-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFormComponent implements OnInit {

  public form: FormGroup;
  public formNames: CatalogsFormNames;
  public reset$: Subject<void>;
  @Output() private formSubmitted: EventEmitter<void>;
  private catalogsStore: Store<CatalogsState>;

  public constructor(catalogsStore: Store<CatalogsState>) {
    this.catalogsStore = catalogsStore;
    this.formSubmitted = new EventEmitter<void>();
    this.formNames = formNames;
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
    this.catalogsStore.dispatch(catalogAdd({catalog: FormUtils.createCatalogRequest(this.form, this.formNames)}));
    if (close) {
      this.formSubmitted.emit();
    }
    this.clearForm();
  }

  private clearForm(): void {
    FormUtils.clearInputs(this.form, '', this.formNames.name);
    FormUtils.clearInputs(this.form, false, this.formNames.assignedToDashboard);
    FormUtils.clearMultiSelect(
      this.form.get(this.formNames.tasks) as FormGroup,
      this.form.get(this.formNames.alarms) as FormGroup,
      this.form.get(this.formNames.notes) as FormGroup,
      this.form.get(this.formNames.bookmarks) as FormGroup,
      this.form.get(this.formNames.files) as FormGroup,
      this.form.get(this.formNames.videos) as FormGroup
    );
    this.reset$.next();
  }
}
