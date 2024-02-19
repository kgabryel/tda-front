import {FormArray, FormGroup} from '@angular/forms';
import {CatalogRequest} from '../requests/catalog.request';
import {CatalogsFormNames} from '../factories/catalog.factory';
import {BookmarkRequest} from '../requests/bookmark.request';
import {BookmarksFormNames} from '../factories/bookmark.factory';
import {NoteRequest} from '../requests/note.request';
import {NotesFormNames} from '../factories/note.factory';

export abstract class FormUtils {
  public static clearInputs(form: FormGroup, value: any, ...names: string[]): void {
    names.forEach(name => {
      form.get(name).reset(value);
      form.get(name).setErrors(null);
      form.get(name).markAsUntouched();
    });
  }

  public static getColorValue(form: FormGroup, name: string): string {
    return '#' + form.get(name).value.hex;
  }

  public static clearPinned(form: FormGroup): void {
    FormUtils.clearMultiSelect(form.get('catalogs') as FormGroup);
    FormUtils.clearMultiSelect(form.get('tasks') as FormGroup);
  }

  public static clearSelect(form: FormGroup): void {
    form.get('search').reset('');
    form.get('search').markAsUntouched();
    form.get('item').reset(null);
  }

  public static clearMultiSelect(...formGroups: FormGroup[]): void {
    formGroups.forEach(formGroup => {
      formGroup.get('search').setValue('');
      formGroup.get('search').markAsUntouched();
      (formGroup.get('items') as FormArray).clear();
      formGroup.get('items').setErrors(null);
    });
  }

  public static mapPinned<T>(form: FormGroup, name: string): T[] {
    return (form.get(name).get('items') as FormArray).controls.map(data => data.value);
  }

  public static createCatalogRequest(form: FormGroup, formNames: CatalogsFormNames): CatalogRequest {
    return {
      name: form.get(formNames.name).value,
      tasks: FormUtils.mapPinned<string>(form, formNames.tasks),
      alarms: FormUtils.mapPinned<string>(form, formNames.alarms),
      notes: FormUtils.mapPinned<number>(form, formNames.notes),
      bookmarks: FormUtils.mapPinned<number>(form, formNames.bookmarks),
      files: FormUtils.mapPinned<number>(form, formNames.files),
      videos: FormUtils.mapPinned<number>(form, formNames.videos),
      assignedToDashboard: form.get(formNames.assignedToDashboard).value
    };
  }

  public static createBookmarkRequest(form: FormGroup, formNames: BookmarksFormNames, edit: boolean): BookmarkRequest {
    return {
      name: form.get(formNames.name).value,
      href: form.get(formNames.href).value,
      backgroundColor: FormUtils.getColorValue(form, formNames.backgroundColor),
      textColor: FormUtils.getColorValue(form, formNames.textColor),
      icon: edit ? form.get(formNames.icon).value : null,
      assignedToDashboard: form.get(formNames.assignedToDashboard).value,
      tasks: FormUtils.mapPinned<string>(form, formNames.tasks),
      catalogs: FormUtils.mapPinned<number>(form, formNames.catalogs)
    };
  }

  public static createNoteRequest(form: FormGroup, formNames: NotesFormNames): NoteRequest {
    return {
      name: form.get(formNames.name).value,
      content: form.get(formNames.content).value,
      textColor: FormUtils.getColorValue(form, formNames.textColor),
      backgroundColor: FormUtils.getColorValue(form, formNames.backgroundColor),
      assignedToDashboard: form.get(formNames.assignedToDashboard).value,
      tasks: FormUtils.mapPinned<string>(form, formNames.tasks),
      catalogs: FormUtils.mapPinned<number>(form, formNames.catalogs)
    };
  }
}
