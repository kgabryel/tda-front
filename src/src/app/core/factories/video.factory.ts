import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {Video} from '../models/video';
import {Length} from '../../config/form.config';


export interface VideosFormNames {
  href: string;
  name: string;
  watched: string;
  search: string;
  items: string;
  tasks: string;
  catalogs: string;
  assignedToDashboard: string;
}

export const formNames: VideosFormNames = {
  href: 'href',
  name: 'name',
  watched: 'watched',
  search: 'search',
  items: 'items',
  tasks: 'tasks',
  catalogs: 'catalogs',
  assignedToDashboard: 'assignedToDashboard'
};

export abstract class VideoFormFactory {
  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.href]: new FormControl('', [Validators.required, CustomValidators.url]),
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
}

export abstract class EditVideoFormFactory {
  public static getForm(video: Video): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(video.name, [
        Validators.required,
        Validators.maxLength(Length.maxVideoNameLength)]),
      [formNames.watched]: new FormControl(video.watched, [Validators.required]),
      [formNames.assignedToDashboard]: new FormControl(video.assignedToDashboard, [Validators.required]),
      [formNames.tasks]: new FormGroup({
        [formNames.items]: new FormArray(video.tasks.map(task => new FormControl(task))),
        [formNames.search]: new FormControl()
      }),
      [formNames.catalogs]: new FormGroup({
        [formNames.items]: new FormArray(video.catalogs.map(catalog => new FormControl(catalog.toString()))),
        [formNames.search]: new FormControl()
      })
    });
  }
}
