import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ColorsFormNames, FormFactory, formNames} from '../../../../core/factories/color.factory';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/colors/reducers';
import {ColorsError, colorsErrors} from '../../../../core/errors/colors.error';
import {Length} from '../../../../config/form.config';
import {ColorRequest} from '../../../../core/requests/color.request';
import {colorAdd} from '../../../../core/store/colors/actions';
import {FormUtils} from '../../../../core/utils/form.utils';

@Component({
  selector: 'settings-add-color',
  templateUrl: './add-color.component.html',
  styleUrls: ['./add-color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddColorComponent implements OnInit {

  public form: FormGroup;
  public formNames: ColorsFormNames;
  public maxNameLength: number;
  public errors: ColorsError;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.formNames = formNames;
    this.store = store;
    this.maxNameLength = Length.maxColorNameLength;
    this.errors = colorsErrors;
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const color: ColorRequest = {
      name: this.form.get(formNames.name).value,
      color: FormUtils.getColorValue(this.form, this.formNames.color)
    };
    this.store.dispatch(colorAdd({color}));
    this.clearForm();
  }

  public clearForm(): void {
    FormUtils.clearInputs(this.form, '', this.formNames.name);
    FormUtils.clearInputs(this.form, null, this.formNames.color);
  }

  public ngOnInit(): void {
    this.form = FormFactory.getForm();
  }
}
