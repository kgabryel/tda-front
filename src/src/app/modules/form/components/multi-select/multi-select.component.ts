import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Item} from '../../../../core/models/item';
import {startWith} from 'rxjs/operators';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {StringUtils} from '../../../../core/utils/string.utils';
import {Observable, Subscription} from 'rxjs';
import {ModeService} from '../../../../core/services/mode/mode.service';

@Component({
  selector: 'form-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectComponent implements OnInit, OnDestroy {

  @Input() public reset: Observable<void>;
  @Input() public formGroup: FormGroup;
  @Input() public hideButtons: boolean = false;
  public filteredValues: Item[];
  public selectedValues: Item[];
  @Input() public translateNames: boolean = false;
  @Input() public sort: boolean = true;
  @Input() public values: Item[];
  @Input() public label: string;
  @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) panelInput: MatAutocompleteTrigger;
  private itemsInputs: FormArray;
  private subscriptions: Subscription[];
  private modeService: ModeService;

  public constructor(modeService: ModeService) {
    this.subscriptions = [];
    this.modeService = modeService;
  }

  public ngOnInit(): void {
    if (this.reset !== undefined) {
      this.subscriptions.push(this.reset.subscribe(() => this.selectedValues = []));
    }
    this.selectedValues = [];
    this.itemsInputs = this.formGroup.get('items') as FormArray;
    this.itemsInputs.value.forEach((item: string) => this.selectedValues.push(this.values.find((value) => value.value === item)));
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(() => this.formGroup.get('search').setErrors(this.itemsInputs.errors))
    );
    this.filter();
  }

  public itemSelected(event: MatAutocompleteSelectedEvent): void {
    this.values.forEach(item => {
      if (item === event.option.value) {
        if (!this.selectedValues.includes(item)) {
          this.selectedValues.push(item);
          this.itemsInputs.push(new FormControl(item.value));
        } else {
          this.selectedValues = this.selectedValues.filter(value => value !== item);
          this.itemsInputs.clear();
          this.selectedValues.forEach(value => this.itemsInputs.push(new FormControl(value.value)));
        }
      }
    });
    this.formGroup.get('search').setValue('');
  }

  public isSelected(value: Item, darkMode: boolean | null = null): boolean {
    if (!this.selectedValues.includes(value)) {
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
    for (let i = 0; i < this.values.length; i++) {
      if (this.selectedValues.includes(this.values[i])) {
        continue;
      }
      if (StringUtils.stringIncludes(this.values[i].display, value)) {
        this.selectedValues.push(this.values[i]);
        this.itemsInputs.push(new FormControl(this.values[i].value));
        this.formGroup.get('search').setValue('');
      }
    }
  }

  public remove(item: Item): void {
    this.selectedValues = this.selectedValues.filter(value => value !== item);
    this.itemsInputs.clear();
    this.selectedValues.forEach(value => this.itemsInputs.push(new FormControl(value.value)));
  }

  public openPanel(): void {
    this.panelInput.openPanel();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
    if (!this.sort) {
      return;
    }
    this.filteredValues = this.filteredValues.sort((a, b) => StringUtils.compareString(a.display, b.display));
  }
}
