import {FormArray, FormControl, FormGroup} from '@angular/forms';

export abstract class FormFactory {
  public static getGroup(values: any[] = []): FormGroup {
    return new FormGroup({
      'items': new FormArray(values.map(number => new FormControl(number))),
      'search': new FormControl()
    });
  }
}
