import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {PaginatePipeArgs} from 'ngx-pagination/dist/paginate.pipe';
import {Alarm, NotificationGroup} from '../../../../core/models/alarm';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'alarms-notifications-groups',
  templateUrl: './notifications-groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsGroupsComponent implements OnInit {

  @Input() public disableEmail: boolean;
  @Input() public notifications: NotificationGroup[];
  @Input() public alarm: Alarm;
  public config$: BehaviorSubject<PaginatePipeArgs>;
  public limitField: FormControl;
  public pageField: FormControl;

  public constructor() {
    this.limitField = new FormControl('0');
    this.pageField = new FormControl(1);
  }

  public ngOnInit(): void {
    this.config$ = new BehaviorSubject<PaginatePipeArgs>({
      id: 'alarmsNotificationsGroups',
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.notifications.length
    });
  }

}
