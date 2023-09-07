import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {Catalog} from '../../../../core/models/catalog';
import {Store} from '@ngrx/store';
import {State as CatalogsState} from '../../../../core/store/catalogs/reducers';
import {State as AlarmsState} from '../../../../core/store/alarms/reducers';
import {selectAlarm} from '../../../../core/store/alarms/selectors';
import {filter, map, switchMap} from 'rxjs/operators';
import {searchPinned, selectCatalogs} from '../../../../core/store/catalogs/selectors';
import {FormControl, FormGroup} from '@angular/forms';
import {Item} from '../../../../core/models/item';
import {formNames, PinnedFactory} from '../../../../core/factories/pinned.factory';
import {catalogAdd, catalogRemove} from '../../../../core/store/alarms/actions';
import {DeleteSheetComponent} from '../../../shared/components/delete-sheet/delete-sheet.component';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {FormUtils} from '../../../../core/utils/form.utils';
import {StringUtils} from '../../../../core/utils/string.utils';
import {ItemUtils} from '../../../../core/utils/item.utils';

@Component({
  selector: 'alarms-catalogs',
  templateUrl: './catalogs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogsComponent implements OnInit, OnDestroy {

  @Input() public alarmId: string;
  public name: FormControl;
  public catalogs$: Observable<Catalog[]>;
  public availableCatalogs$: Observable<Item[]>;
  public form: FormGroup;
  public editable$: Observable<boolean>;
  private catalogsStore: Store<CatalogsState>;
  private alarmsStore: Store<AlarmsState>;
  private deleteSheet: MatBottomSheet;
  private searched$: BehaviorSubject<string>;
  private subscription: Subscription;

  public constructor(catalogsStore: Store<CatalogsState>,
    alarmsStore: Store<AlarmsState>,
    deleteSheet: MatBottomSheet
  ) {
    this.catalogsStore = catalogsStore;
    this.alarmsStore = alarmsStore;
    this.deleteSheet = deleteSheet;
    this.searched$ = new BehaviorSubject<string>('');
    this.name = new FormControl('');
  }

  private static filter(selectedCatalogs: Catalog[], catalog: Catalog): boolean {
    return !selectedCatalogs.map(catalog => catalog.id).includes(catalog.id);
  }

  public ngOnInit(): void {
    this.form = PinnedFactory.getForm();
    this.name.setValue('');
    this.subscription = this.name.valueChanges.subscribe(() => this.search());
    let catalogs$ = this.alarmsStore.select(selectAlarm(this.alarmId)).pipe(
      filter(alarm => alarm !== undefined),
      map(alarm => alarm.periodic || alarm.group === null ? alarm.id : alarm.group),
      switchMap(alarmId => this.alarmsStore.select(selectAlarm(alarmId))),
      map(selectedAlarm => selectedAlarm.catalogs)
    );

    this.catalogs$ = combineLatest([catalogs$, this.searched$]).pipe(
      switchMap(values => this.catalogsStore.select(searchPinned(values[0], values[1]))),
      map(catalogs => catalogs.sort((a, b) => StringUtils.compareString(a.name, b.name)))
    );

    this.editable$ = this.alarmsStore.select(selectAlarm(this.alarmId)).pipe(
      filter(alarm => alarm !== undefined),
      map(alarm => alarm.periodic || alarm.group === null)
    );

    this.availableCatalogs$ = this.catalogs$.pipe(
      switchMap(selectedCatalogs => this.alarmsStore.select(selectCatalogs)
        .pipe(map(catalogs => catalogs.filter(catalog => CatalogsComponent.filter(selectedCatalogs, catalog))))),
      map(catalogs => ItemUtils.catalogsToItems(catalogs))
    );
  }

  public delete(id: number): void {
    const sheetRef = this.deleteSheet.open(DeleteSheetComponent);
    sheetRef.afterDismissed()
      .pipe(filter(action => action))
      .subscribe(() => this.alarmsStore.dispatch(catalogRemove({alarmId: this.alarmId, catalogId: id})));
  }

  public search(): void {
    this.searched$.next(this.name.value);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const catalogId = this.form.get(formNames.item).value.value;
    this.alarmsStore.dispatch(catalogAdd({alarmId: this.alarmId, catalogId}));
    this.clearForm();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private clearForm(): void {
    FormUtils.clearSelect(this.form);
  }
}
