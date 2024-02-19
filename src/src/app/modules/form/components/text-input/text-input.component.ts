import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'form-text-input',
  templateUrl: './text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInputComponent implements OnInit {

  @Input() public field: FormControl;
  @Input() public label: string;
  @Input() public prefix: string;
  @Input() public part: string;
  @Input() public errors: string[];
  @Input() public maxLength: number;
  public length$: Observable<number>;

  public ngOnInit(): void {
    this.length$ = this.field.valueChanges.pipe(startWith(''), map(data => data.length));
  }
}
