import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Length} from '../../config/form.config';
import {Catalog} from '../models/catalog';

export const formNames: CatalogsFormNames = {
  name: 'name',
  search: 'search',
  items: 'items',
  tasks: 'tasks',
  alarms: 'alarms',
  notes: 'notes',
  bookmarks: 'bookmarks',
  files: 'files',
  videos: 'videos',
  assignedToDashboard: 'assignedToDashboard'
};

export interface CatalogsFormNames {
  name: string;
  search: string;
  items: string;
  tasks: string;
  alarms: string;
  notes: string;
  bookmarks: string;
  files: string;
  videos: string;
  assignedToDashboard: string;
}

export abstract class FormFactory {
  public static getCreateForm(): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxCatalogNameLength)]),
      [formNames.assignedToDashboard]: new FormControl(false, [Validators.required]),
      [formNames.tasks]: new FormGroup({
        [formNames.items]: new FormArray([]),
        [formNames.search]: new FormControl()
      }),
      [formNames.alarms]: new FormGroup({
        [formNames.items]: new FormArray([]),
        [formNames.search]: new FormControl()
      }),
      [formNames.notes]: new FormGroup({
        [formNames.items]: new FormArray([]),
        [formNames.search]: new FormControl()
      }),
      [formNames.bookmarks]: new FormGroup({
        [formNames.items]: new FormArray([]),
        [formNames.search]: new FormControl()
      }),
      [formNames.files]: new FormGroup({
        [formNames.items]: new FormArray([]),
        [formNames.search]: new FormControl()
      }),
      [formNames.videos]: new FormGroup({
        [formNames.items]: new FormArray([]),
        [formNames.search]: new FormControl()
      })
    });
  }

  public static getEditForm(catalog: Catalog): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(catalog.name, [
        Validators.required,
        Validators.maxLength(Length.maxCatalogNameLength)]),
      [formNames.assignedToDashboard]: new FormControl(catalog.assignedToDashboard, [Validators.required]),
      [formNames.tasks]: new FormGroup({
        [formNames.items]: new FormArray(catalog.tasks.map(task => new FormControl(task))),
        [formNames.search]: new FormControl()
      }),
      [formNames.alarms]: new FormGroup({
        [formNames.items]: new FormArray(catalog.alarms.map(alarm => new FormControl(alarm))),
        [formNames.search]: new FormControl()
      }),
      [formNames.notes]: new FormGroup({
        [formNames.items]: new FormArray(catalog.notes.map(note => new FormControl(note.toString()))),
        [formNames.search]: new FormControl()
      }),
      [formNames.bookmarks]: new FormGroup({
        [formNames.items]: new FormArray(catalog.bookmarks.map(bookmark => new FormControl(bookmark.toString()))),
        [formNames.search]: new FormControl()
      }),
      [formNames.files]: new FormGroup({
        [formNames.items]: new FormArray(catalog.files.map(file => new FormControl(file.toString()))),
        [formNames.search]: new FormControl()
      }),
      [formNames.videos]: new FormGroup({
        [formNames.items]: new FormArray(catalog.videos.map(video => new FormControl(video.toString()))),
        [formNames.search]: new FormControl()
      })
    });
  }
}
