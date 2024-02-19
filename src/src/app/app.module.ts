import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthModule} from './modules/auth/auth.module';
import {AuthGuard} from './core/guards/auth/auth.guard';
import {GuestGuard} from './core/guards/guest/guest.guard';
import {AuthService} from './core/services/auth/auth.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {environment} from '../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {LangService} from './core/services/lang/lang.service';
import {ServiceWorkerModule} from '@angular/service-worker';
import {SharedModule} from './modules/shared/shared.module';
import {TaskStatusContainer} from './core/containers/task-status.container';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {
  NgxMatDateAdapter,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {PaginationTranslationsService} from './core/services/pagination-translations/pagination-translations.service';
import {CustomDateProvider} from './core/providers/customDateProvider';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {StoreService} from './core/services/store/store.service';
import {EventsService} from './core/services/events/events.service';
import {QuillModule} from 'ngx-quill';
import {ModeService} from './core/services/mode/mode.service';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

let imports = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  AuthModule,
  HttpClientModule,
  StoreModule.forRoot({}),
  EffectsModule.forRoot([]),
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  }),
  ServiceWorkerModule.register('ngsw-worker.js', {enabled: true}),
  ServiceWorkerModule.register('alarms-actions.js', {enabled: true}),
  SharedModule,
  MatDatepickerModule,
  MatNativeDateModule,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
  ToastrModule.forRoot(),
  QuillModule.forRoot()
];
if (!environment.production) {
  imports.push(StoreDevtoolsModule.instrument({
    logOnly: environment.production
  }));
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: imports,
  providers: [
    AuthGuard,
    GuestGuard,
    AuthService,
    HttpClient,
    LangService,
    TaskStatusContainer,
    {provide: DateAdapter, useClass: CustomDateProvider},
    {provide: NgxMatDateAdapter, useClass: CustomDateProvider},
    {
      provide: MatPaginatorIntl,
      useClass: PaginationTranslationsService
    },
    ToastrService,
    EventsService,
    StoreService,
    ModeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
