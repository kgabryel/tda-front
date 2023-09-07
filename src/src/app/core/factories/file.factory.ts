import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MaxSizeValidator} from '@angular-material-components/file-input';
import {Length} from '../../config/form.config';
import {File} from '../models/file';

export interface FilesFormNames {
  name: string;
  file: string;
  search: string;
  items: string;
  tasks: string;
  catalogs: string;
  assignedToDashboard: string;
}

export const formNames: FilesFormNames = {
  name: 'name',
  file: 'file',
  search: 'search',
  items: 'items',
  tasks: 'tasks',
  catalogs: 'catalogs',
  assignedToDashboard: 'assignedToDashboard'
};

export abstract class FileFormFactory {
  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxFileNameLength)]),
      [formNames.file]: new FormControl(null, [Validators.required, MaxSizeValidator(Length.maxFileSize)]),
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

  public static getEditForm(file: File): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(file.name, [
        Validators.required,
        Validators.maxLength(Length.maxFileNameLength)]),
      [formNames.assignedToDashboard]: new FormControl(file.assignedToDashboard, [Validators.required]),
      [formNames.tasks]: new FormGroup({
        [formNames.items]: new FormArray(file.tasks.map(task => new FormControl(task))),
        [formNames.search]: new FormControl()
      }),
      [formNames.catalogs]: new FormGroup({
        [formNames.items]: new FormArray(file.catalogs.map(catalog => new FormControl(catalog.toString()))),
        [formNames.search]: new FormControl()
      })
    });
  }

  public static getEditFileForm(): FormGroup {
    return new FormGroup({
      [formNames.file]: new FormControl(null, [Validators.required, MaxSizeValidator(Length.maxFileSize)])
    });
  }
}
