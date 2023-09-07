import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Bookmark} from '../models/bookmark';
import {CustomValidators} from 'ng2-validation';
import {Length} from '../../config/form.config';
import {ColorUtils} from '../utils/color.utils';

export const basicTextColor: string = '#000000';
export const basicBackgroundColor: string = '#ffffff';

export interface BookmarksFormNames {
  name: string;
  href: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  assignedToDashboard: string;
  search: string;
  items: string;
  tasks: string;
  catalogs: string;
}

export const formNames: BookmarksFormNames = {
  name: 'name',
  href: 'href',
  backgroundColor: 'backgroundColor',
  textColor: 'textColor',
  assignedToDashboard: 'assignedToDashboard',
  search: 'search',
  items: 'items',
  tasks: 'tasks',
  catalogs: 'catalogs',
  icon: 'icon'
};

export abstract class FormFactory {
  public static getCreateForm(): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl('', [
        Validators.required,
        Validators.maxLength(Length.maxBookmarkNameLength)]),
      [formNames.href]: new FormControl('', [Validators.required, CustomValidators.url]),
      [formNames.assignedToDashboard]: new FormControl(false, [Validators.required]),
      [formNames.textColor]: new FormControl(ColorUtils.hexToColor(basicTextColor), [Validators.required]),
      [formNames.backgroundColor]: new FormControl(ColorUtils.hexToColor(basicBackgroundColor), [Validators.required]),
      [formNames.tasks]: new FormGroup({
        [formNames.items]: new FormArray([]),
        [formNames.search]: new FormControl()
      }),
      [formNames.catalogs]: new FormGroup({
        [formNames.items]: new FormArray([]),
        [formNames.search]: new FormControl()
      })
    });
  }

  public static getEditForm(bookmark: Bookmark): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(bookmark.name, [
        Validators.required,
        Validators.maxLength(Length.maxBookmarkNameLength)]),
      [formNames.href]: new FormControl(bookmark.href, [Validators.required, CustomValidators.url]),
      [formNames.assignedToDashboard]: new FormControl(bookmark.assignedToDashboard, [Validators.required]),
      [formNames.textColor]: new FormControl(ColorUtils.hexToColor(bookmark.textColor), [Validators.required]),
      [formNames.backgroundColor]: new FormControl(ColorUtils.hexToColor(bookmark.backgroundColor), [Validators.required]),
      [formNames.icon]: new FormControl(bookmark.icon, [CustomValidators.url]),
      [formNames.tasks]: new FormGroup({
        [formNames.items]: new FormArray(bookmark.tasks.map(task => new FormControl(task))),
        [formNames.search]: new FormControl()
      }),
      [formNames.catalogs]: new FormGroup({
        [formNames.items]: new FormArray(bookmark.catalogs.map(catalog => new FormControl(catalog.toString()))),
        [formNames.search]: new FormControl()
      })
    });
  }
}
