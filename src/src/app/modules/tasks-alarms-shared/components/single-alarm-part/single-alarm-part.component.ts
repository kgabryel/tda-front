import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AlarmsFormNames, formNames} from '../../../../core/factories/alarm.factory';
import {singleAlarmErrors, SingleAlarmErrors} from '../../../../core/errors/alarms.error';
import {Length} from '../../../../config/form.config';
import {Observable, Subject} from 'rxjs';
import {Item} from '../../../../core/models/item';
import {selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {map} from 'rxjs/operators';
import {ItemUtils} from '../../../../core/utils/item.utils';
import {Store} from '@ngrx/store';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';

@Component({
  selector: 'shared-single-alarm-part',
  templateUrl: './single-alarm-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleAlarmPartComponent implements OnInit {

  @Input() public form: FormGroup;
  public formNames: AlarmsFormNames;
  public errors: SingleAlarmErrors;
  public maxNameLength: number;
  public catalogs$: Observable<Item[]>;
  @Input() public reset$: Subject<void>;
  private catalogsStore: Store<CatalogsState>;

  public constructor(catalogsStore: Store<CatalogsState>) {
    this.catalogsStore = catalogsStore;
    this.formNames = formNames;
    this.errors = singleAlarmErrors;
    this.maxNameLength = Length.maxAlarmNameLength;
  }

  public ngOnInit(): void {
    this.catalogs$ = this.catalogsStore.select(selectCatalogs)
      .pipe(map(catalogs => ItemUtils.catalogsToItems(catalogs)));
  }
}
