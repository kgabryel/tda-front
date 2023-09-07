import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Item} from '../../../../core/models/item';
import {startWith} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {StringUtils} from '../../../../core/utils/string.utils';
import {ModeService} from '../../../../core/services/mode/mode.service';

@Component({
  selector: 'form-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements OnInit {

  @Input() public formGroup: FormGroup;
  public filteredValues: Item[];
  @Input() public values: Item[];
  @Input() public label: string;
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) panelInput: MatAutocompleteTrigger;
  private itemInput: FormControl;
  private modeService: ModeService;

  public constructor(modeService: ModeService) {
    this.modeService = modeService;
  }

  public ngOnInit(): void {
    this.itemInput = this.formGroup.get('item') as FormControl;
    this.itemInput.setValue(null);
    this.filter();
  }

  public itemSelected(event: MatAutocompleteSelectedEvent): void {
    this.itemInput.setValue(event.option.value);
    this.formGroup.get('search').setValue(event.option.value.display);
    this.itemInput.markAsTouched();
    this.itemInput.updateValueAndValidity();
  }

  public isSelected(value: Item, darkMode: boolean | null = null): boolean {
    if (this.itemInput.value !== value) {
      return false;
    }
    if (darkMode === null) {
      return true;
    }
    const mode = this.modeService.getValue();
    return darkMode ? mode === 'dark' : mode === 'light';
  }

  public selected(): void {
    const value = this.formGroup.get('search').value;
    let filtered = this.values.filter(item => StringUtils.stringIncludes(item.display, value));
    if (filtered.length > 0) {
      this.itemInput.setValue(filtered[0]);
      this.formGroup.get('search').setValue(filtered[0].display);
      this.itemInput.markAsTouched();
      this.itemInput.updateValueAndValidity();
    }
  }

  public openPanel(): void {
    this.panelInput.openPanel();
  }

  public clear(): void {
    this.formGroup.get('search').setValue('');
    this.itemInput.setValue(null);
  }

  private filter(): void {
    this.formGroup.get('search').valueChanges.pipe(startWith('')).subscribe(value => {
      let inputValue = value === null || value.constructor === String ? value : value.display;
      if (inputValue === '' || inputValue === null) {
        this.filteredValues = this.values;
        return;
      }
      this.filteredValues = [];
      this.values.filter(item => StringUtils.stringIncludes(item.display, inputValue))
        .forEach(item => this.filteredValues.push(item));
    });
    this.filteredValues = this.filteredValues.sort((a, b) => StringUtils.compareString(a.display, b.display));
  }
}
