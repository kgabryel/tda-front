import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AlarmsFormNames, formNames} from '../../../../../core/factories/alarm.factory';
import {intervalAlarmTypes, Type} from '../../../../../config/interval-types.config';
import {PeriodicAlarmErrors, periodicAlarmErrors} from '../../../../../core/errors/alarms.error';
import {Length} from '../../../../../config/form.config';
import {Observable, Subject} from 'rxjs';
import {Item} from '../../../../../core/models/item';
import {Store} from '@ngrx/store';
import {State as CatalogsState} from '../../../../../core/store/catalogs/reducers';
import {selectCatalogs} from '../../../../../core/store/catalogs/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../../core/utils/item.utils';

@Component({
  selector: 'alarms-periodic-main-part',
  templateUrl: './main-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPartComponent implements OnInit {

  @Input() public form: FormGroup;
  public formNames: AlarmsFormNames;
  public types: Type[];
  public errors: PeriodicAlarmErrors;
  public maxNameLength: number;
  @Input() public reset$: Subject<void>;
  public catalogs$: Observable<Item[]>;
  private catalogsStore: Store<CatalogsState>;

  public constructor(catalogsStore: Store<CatalogsState>) {
    this.types = intervalAlarmTypes;
    this.formNames = formNames;
    this.errors = periodicAlarmErrors;
    this.maxNameLength = Length.maxAlarmNameLength;
    this.catalogsStore = catalogsStore;
  }

  public ngOnInit(): void {
    this.catalogs$ = this.catalogsStore.select(selectCatalogs)
      .pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
  }
}
