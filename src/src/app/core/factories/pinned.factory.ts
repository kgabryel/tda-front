import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Item} from '../models/item';

export interface PinnedFormNames {
  item: string;
  search: string;
}

export const formNames: PinnedFormNames = {
  item: 'item',
  search: 'search'
};

export abstract class PinnedFactory {
  public static getForm(value: Item | null = null): FormGroup {
    return new FormGroup({
      [formNames.item]: new FormControl(value, [Validators.required]),
      [formNames.search]: new FormControl()
    });
  }
}
