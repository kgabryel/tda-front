import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Length} from '../../config/form.config';
import {DateValidator} from '../validators/date.validator';


export interface AlarmsFormNames {
  mainGroup: string;
  notificationsGroup: string;
  notifications: string;
  typesGroup: string;
  contentGroup: string;
  items: string;
  search: string;
  start: string;
  stop: string;
  interval: string;
  intervalType: string;
  name: string;
  content: string;
  notificationTime: string;
  notificationType: string;
  catalogs: string;
}

export const formNames: AlarmsFormNames = {
  mainGroup: 'main',
  notificationsGroup: 'notificationsGroup',
  notifications: 'notifications',
  typesGroup: 'typesGroup',
  contentGroup: 'contentGroup',
  items: 'items',
  search: 'search',
  start: 'start',
  stop: 'stop',
  interval: 'interval',
  intervalType: 'intervalType',
  name: 'name',
  content: 'content',
  notificationTime: 'notificationTime',
  notificationType: 'notificationType',
  catalogs: 'catalogs'
};

export abstract class SingleFormFactory {

  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.mainGroup]: new FormGroup({
        [formNames.name]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxAlarmNameLength)]),
        [formNames.content]: new FormControl(''),
        [formNames.catalogs]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        })
      }),
      [formNames.notificationsGroup]: new FormArray([SingleFormFactory.getNotificationPart()])
    });
  }

  public static getNotificationPart(): FormGroup {
    return new FormGroup({
      [formNames.typesGroup]: new FormGroup({
        [formNames.items]: new FormArray([], [Validators.required]),
        [formNames.search]: new FormControl()
      }),
      [formNames.notificationTime]: new FormControl('', [Validators.required])
    });
  }
}

export abstract class PeriodicFormFactory {
  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.mainGroup]: new FormGroup({
        [formNames.name]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxAlarmNameLength)]),
        [formNames.start]: new FormControl(null, [Validators.required]),
        [formNames.stop]: new FormControl(null, [DateValidator.different]),
        [formNames.interval]: new FormControl(1, [Validators.required, Validators.min(1)]),
        [formNames.intervalType]: new FormControl('', [Validators.required]),
        [formNames.catalogs]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        })
      }),
      [formNames.contentGroup]: new FormGroup({
        [formNames.content]: new FormControl()
      }),
      [formNames.notificationsGroup]: new FormArray(
        [PeriodicFormFactory.getNotificationPart()],
        [Validators.required]
      )
    });
  }

  public static getNotificationPart(): FormGroup {
    return new FormGroup({
      [formNames.notificationTime]: new FormControl('', [Validators.required]),
      [formNames.notificationType]: new FormControl('', [Validators.required]),
      [formNames.interval]: new FormControl(1),
      [formNames.typesGroup]: new FormGroup({
        [formNames.items]: new FormArray([], Validators.required),
        [formNames.search]: new FormControl()
      })
    });
  }
}

export abstract class NotificationFormFactory {
  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.notificationTime]: new FormControl('', [Validators.required]),
      [formNames.typesGroup]: new FormGroup({
        [formNames.items]: new FormArray([], Validators.required),
        [formNames.search]: new FormControl()
      })
    });
  }
}
