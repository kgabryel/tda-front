import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Length} from '../../config/form.config';
import {ColorUtils} from '../utils/color.utils';

export const basicColor: string = '#ffffff';
export const formNames: ColorsFormNames = {
  name: 'name',
  color: 'color'
};

export interface ColorsFormNames {
  name: string;
  color: string;
}

export abstract class FormFactory {
  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxColorNameLength)]),
      [formNames.color]: new FormControl(ColorUtils.hexToColor(basicColor), [Validators.required])
    });
  }
}
