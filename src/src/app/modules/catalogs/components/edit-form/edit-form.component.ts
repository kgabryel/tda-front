import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CatalogsFormNames, FormFactory, formNames} from '../../../../core/factories/catalog.factory';
import {Store} from '@ngrx/store';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {Catalog} from '../../../../core/models/catalog';
import {FormUtils} from '../../../../core/utils/form.utils';
import {catalogUpdate} from '../../../../core/store/catalogs/actions';

@Component({
  selector: 'catalogs-edit-form',
  templateUrl: './edit-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditFormComponent implements OnInit {

  public form: FormGroup;
  public formNames: CatalogsFormNames;
  @Input() public catalog: Catalog;
  @Output() private formSubmitted: EventEmitter<void>;
  private catalogsStore: Store<CatalogsState>;

  public constructor(catalogsStore: Store<CatalogsState>) {
    this.catalogsStore = catalogsStore;
    this.formNames = formNames;
    this.formSubmitted = new EventEmitter<void>();
  }

  public ngOnInit(): void {
    this.form = FormFactory.getEditForm(this.catalog);
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.catalogsStore.dispatch(catalogUpdate({
      id: this.catalog.id,
      catalog: FormUtils.createCatalogRequest(this.form, this.formNames)
    }));
    this.formSubmitted.emit();
  }
}
