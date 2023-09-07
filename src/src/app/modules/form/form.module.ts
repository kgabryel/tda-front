import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  MAT_COLOR_FORMATS,
  NGX_MAT_COLOR_FORMATS,
  NgxMatColorPickerModule
} from '@angular-material-components/color-picker';
import {ColorInputComponent} from './components/color-input/color-input.component';
import {MultiSelectComponent} from './components/multi-select/multi-select.component';
import {SelectComponent} from './components/select/select.component';
import {TextInputComponent} from './components/text-input/text-input.component';
import {TimePickerComponent} from './components/time-picker/time-picker.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {ColorComponent} from './components/color/color.component';
import {ErrorMessageComponent} from './components/error-message/error-message.component';
import {ErrorsContainerComponent} from './components/errors-container/errors-container.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {YesNoSelectComponent} from './components/yes-no-select/yes-no-select.component';
import {MatSelectModule} from '@angular/material/select';
import {PipesModule} from '../pipes/pipes.module';

@NgModule({
  declarations: [
    ColorInputComponent,
    MultiSelectComponent,
    SelectComponent,
    TextInputComponent,
    TimePickerComponent,
    ColorComponent,
    ErrorMessageComponent,
    ErrorsContainerComponent,
    YesNoSelectComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    NgxMatColorPickerModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatSelectModule,
    PipesModule
  ],
  exports: [
    ColorInputComponent,
    MultiSelectComponent,
    SelectComponent,
    TextInputComponent,
    TimePickerComponent,
    ColorComponent,
    ErrorMessageComponent,
    ErrorsContainerComponent,
    YesNoSelectComponent
  ],
  providers: [
    {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS}
  ]
})
export class FormModule {
}
