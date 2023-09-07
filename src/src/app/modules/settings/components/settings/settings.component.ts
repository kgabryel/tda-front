import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/settings/reducers';
import {
  selectDefaultPagination,
  selectNotificationLanguage,
  selectSettings
} from '../../../../core/store/settings/selectors';
import {MatSelectChange} from '@angular/material/select';
import {changeSettings, changeSettingsError} from '../../../../core/store/settings/actions';
import {Observable, Subscription} from 'rxjs';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {availableLanguages, availableModes, settingsConfig, settingsFields} from '../../../../config/settings.config';
import {Actions, ofType} from '@ngrx/effects';
import {pageSizeOptions} from '../../../../config/pagination.config';
import {ModeService} from '../../../../core/services/mode/mode.service';
import {StringUtils} from '../../../../core/utils/string.utils';
import {SwPush} from '@angular/service-worker';
import {map, startWith} from 'rxjs/operators';
import {PushNotificationService} from '../../../../core/services/push-notification/push-notification.service';

@Component({
  selector: 'settings-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {

  public paginationField: FormControl;
  public notificationLanguageField: FormControl;
  public modeField: FormControl;
  public settings$: Observable<boolean>[];
  public availableSettings: string[];
  public modeOptions: string[];
  public settingsFields: Map<string, FormControl>;
  public pageSizeOptions: string[];
  public languageOptions: string[];
  public notificationEnabled$: Observable<boolean>;
  private store: Store<State>;
  private subscriptions: Subscription[];
  private modeService: ModeService;
  private updates$: Actions;
  private pushNotificationService: PushNotificationService;
  private swPush: SwPush;

  public constructor(store: Store<State>,
    updates$: Actions,
    modeService: ModeService,
    swPush: SwPush,
    pushNotificationService: PushNotificationService) {
    this.updates$ = updates$;
    this.store = store;
    this.modeService = modeService;
    this.paginationField = new FormControl('0');
    this.notificationLanguageField = new FormControl('');
    this.modeField = new FormControl(modeService.getValue());
    this.availableSettings = settingsConfig;
    this.modeOptions = availableModes;
    this.settings$ = [];
    this.settingsFields = settingsFields;
    this.pageSizeOptions = pageSizeOptions;
    this.languageOptions = availableLanguages;
    this.pushNotificationService = pushNotificationService;
    this.swPush = swPush;
  }

  public ngOnInit(): void {
    this.subscriptions = [
      this.updates$.pipe(ofType(changeSettingsError)).subscribe(() => {
        this.store.select(selectNotificationLanguage)
          .subscribe(notificationLang => this.notificationLanguageField.setValue(notificationLang));
        this.store.select(selectDefaultPagination)
          .subscribe(paginationValue => this.paginationField.setValue(paginationValue.toString()));
        this.availableSettings.map(value => this.toCamelCase(value)).forEach(settings => {
          this.store.select(selectSettings(settings))
            .subscribe(value => this.settingsFields.get(settings).setValue(value));
        });
      }),
      this.store.select(selectDefaultPagination)
        .subscribe(paginationValue => this.paginationField.setValue(paginationValue.toString())),
      this.store.select(selectNotificationLanguage)
        .subscribe(notificationLang => this.notificationLanguageField.setValue(notificationLang))
    ];
    this.availableSettings.map(value => this.toCamelCase(value)).forEach(settings => {
      this.settings$[settings] = this.store.select(selectSettings(settings));
      this.store.select(selectSettings(settings))
        .subscribe(value => this.settingsFields.get(settings).setValue(value));
    });
    this.pushNotificationService.subscribe();
    this.notificationEnabled$ = this.swPush.subscription.pipe(
      startWith(null),
      map(state => state !== null)
    );
  }

  public changeDefaultPagination(value: MatSelectChange): void {
    this.store.dispatch(changeSettings({field: 'default-pagination', value: value.value}));
  }

  public changeNotificationLanguage(value: MatSelectChange): void {
    this.store.dispatch(changeSettings({field: 'notification-language', value: value.value}));
  }

  public changeMode(value: MatSelectChange): void {
    this.modeService.changeStatus(value.value);
  }

  public changeSettings(field: string, value: MatSlideToggleChange): void {
    this.store.dispatch(changeSettings({field, value: value.checked}));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscribe => subscribe.unsubscribe());
  }

  public toCamelCase(value: string) {
    return StringUtils.toCamelCase(value);
  }

  public subscribePushNotification(): void {
    this.pushNotificationService.subscribe();
  }
}
