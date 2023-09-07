import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Alarm} from '../../../../core/models/alarm';
import {BehaviorSubject} from 'rxjs';
import {PaginatePipeArgs} from 'ngx-pagination/dist/paginate.pipe';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'alarms-alarms',
  templateUrl: './alarms.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmsComponent implements OnInit {

  @Input() public alarm: Alarm;
  @Input() public alarms: Alarm[];
  public config$: BehaviorSubject<PaginatePipeArgs>;
  public limitField: FormControl;
  public pageField: FormControl;

  public ngOnInit(): void {
    this.config$ = new BehaviorSubject<PaginatePipeArgs>({
      id: `alarmsGroupsAlarms_${this.alarm.id}`,
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.alarms.length
    });
    this.limitField = new FormControl('0');
    this.pageField = new FormControl(1);

  }
}
