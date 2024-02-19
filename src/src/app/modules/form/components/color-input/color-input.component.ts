import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Color as ColorPickerValue} from '@angular-material-components/color-picker/lib/models/color.model';
import {selectColors} from '../../../../core/store/colors/selectors';
import {Observable} from 'rxjs';
import {Color} from '../../../../core/models/color';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/colors/reducers';

@Component({
  selector: 'form-color-input',
  templateUrl: './color-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorInputComponent implements OnInit {

  @Input() public field: FormControl;
  @Input() public label: string;
  @Input() public prefix: string;
  @Input() public part: string;
  @Input() public errors: string[];
  @Input() public simple: boolean = true;
  public colors$: Observable<Color[]>;
  private store: Store<State>;

  public constructor(store: Store<State>) {
    this.store = store;
  }

  public selectColor(color: ColorPickerValue): void {
    this.field.setValue(color);
  }

  public ngOnInit(): void {
    this.colors$ = this.store.select(selectColors);
  }
}
