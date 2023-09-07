import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Alarm} from '../../../../core/models/alarm';
import {Observable} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {b2} from '../../../../config/sizes.config';

@Component({
  selector: 'simple-view-alarm-single',
  templateUrl: './alarm-single.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlarmSingleComponent implements OnInit {

  @Input() public alarm: Alarm;
  public small$: Observable<boolean>;
  @Output() private undo: EventEmitter<string>;
  private breakpointObserver: BreakpointObserver;

  public constructor(breakpointObserver: BreakpointObserver) {
    this.breakpointObserver = breakpointObserver;
    this.undo = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this.small$ = this.breakpointObserver.observe(b2).pipe(map(data => data.matches));
  }

  public remove(): void {
    this.undo.emit(this.alarm.id);
  }
}
