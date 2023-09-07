import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Note} from '../models/note';
import {Length} from '../../config/form.config';
import {ColorUtils} from '../utils/color.utils';

export const basicTextColor: string = '#000000';
export const basicBackgroundColor: string = '#ffffff';

export interface NotesFormNames {
  name: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  assignedToDashboard: string;
  search: string;
  items: string;
  tasks: string;
  catalogs: string;
}

export const formNames: NotesFormNames = {
  name: 'name',
  content: 'content',
  backgroundColor: 'backgroundColor',
  textColor: 'textColor',
  assignedToDashboard: 'assignedToDashboard',
  search: 'search',
  items: 'items',
  tasks: 'tasks',
  catalogs: 'catalogs'
};

export abstract class FormFactory {
  public static getCreateForm(): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxNoteNameLength)]),
      [formNames.content]: new FormControl(''),
      [formNames.backgroundColor]: new FormControl(ColorUtils.hexToColor(basicBackgroundColor), [Validators.required]),
      [formNames.textColor]: new FormControl(ColorUtils.hexToColor(basicTextColor), [Validators.required]),
      [formNames.assignedToDashboard]: new FormControl(false, [Validators.required]),
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

  public static getEditForm(note: Note): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(note.name, [
        Validators.required,
        Validators.maxLength(Length.maxNoteNameLength)]),
      [formNames.content]: new FormControl(note.content),
      [formNames.backgroundColor]: new FormControl(ColorUtils.hexToColor(note.backgroundColor), [Validators.required]),
      [formNames.textColor]: new FormControl(ColorUtils.hexToColor(note.textColor), [Validators.required]),
      [formNames.assignedToDashboard]: new FormControl(note.assignedToDashboard, [Validators.required]),
      [formNames.tasks]: new FormGroup({
        [formNames.items]: new FormArray(note.tasks.map(task => new FormControl(task))),
        [formNames.search]: new FormControl()
      }),
      [formNames.catalogs]: new FormGroup({
        [formNames.items]: new FormArray(note.catalogs.map(catalog => new FormControl(catalog.toString()))),
        [formNames.search]: new FormControl()
      })
    });
  }
}
