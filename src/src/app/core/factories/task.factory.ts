import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {Length} from '../../config/form.config';
import {DateValidator} from '../validators/date.validator';
import {TaskValidator} from '../validators/task.validator';

export interface TasksFormNames {
  taskGroup: string;
  alarmGroup: string;
  name: string;
  content: string;
  typesGroup: string;
  types: string;
  search: string;
  task: string;
  typeSearch: string;
  notifications: string;
  notificationTime: string;
  notificationType: string;
  dates: string;
  start: string;
  stop: string;
  date: string;
  interval: string;
  intervalType: string;
  items: string;
  notificationsGroup: string;
  catalogs: string;
  pinnedGroup: string;
  notes: string;
  bookmarks: string;
  videos: string;
  files: string;
  mainTask: string;
  alarmIncluded: string;
  item: string;
}

export const formNames: TasksFormNames = {
  taskGroup: 'task',
  alarmGroup: 'alarm',
  name: 'name',
  content: 'content',
  typesGroup: 'typesGroup',
  types: 'types',
  search: 'search',
  task: 'task',
  typeSearch: 'typeSearch',
  notifications: 'notifications',
  notificationTime: 'notificationTime',
  notificationType: 'notificationType',
  dates: 'dates',
  start: 'start',
  stop: 'stop',
  date: 'date',
  interval: 'interval',
  intervalType: 'intervalType',
  items: 'items',
  notificationsGroup: 'notificationsGroup',
  catalogs: 'catalogs',
  pinnedGroup: 'pinnedGroup',
  bookmarks: 'bookmarks',
  notes: 'notes',
  files: 'files',
  videos: 'videos',
  mainTask: 'mainTask',
  alarmIncluded: 'alarmIncluded',
  item: 'item'
};

export abstract class SingleFormFactory {
  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.mainTask]: new FormControl(true, [Validators.required]),
      [formNames.alarmIncluded]: new FormControl(false, [Validators.required]),
      [formNames.taskGroup]: new FormGroup({
        [formNames.name]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxTaskNameLength)]),
        [formNames.content]: new FormControl(''),
        [formNames.date]: new FormControl(null),
        [formNames.item]: new FormControl(null, [TaskValidator.mainTask]),
        [formNames.search]: new FormControl()
      }),
      [formNames.pinnedGroup]: new FormGroup({
        [formNames.catalogs]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.notes]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.bookmarks]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.files]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.videos]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        })
      }),
      [formNames.alarmGroup]: new FormGroup({
        [formNames.name]: new FormControl('', [
          TaskValidator.nameRequired,
          Validators.maxLength(Length.maxAlarmNameLength)]),
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
        [formNames.items]: new FormArray([], [TaskValidator.notificationTypesRequired]),
        [formNames.search]: new FormControl()
      }),
      [formNames.notificationTime]: new FormControl('', [TaskValidator.notificationTimeRequired])
    });
  }
}

export abstract class PeriodicFormFactory {
  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.alarmIncluded]: new FormControl(false, [Validators.required]),
      [formNames.taskGroup]: new FormGroup({
        [formNames.name]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxTaskNameLength)]),
        [formNames.content]: new FormControl(''),
        [formNames.dates]: new FormGroup({
          [formNames.start]: new FormControl(null, [Validators.required]),
          [formNames.stop]: new FormControl(null, [DateValidator.different])
        }),
        [formNames.interval]: new FormControl(1, [Validators.required, Validators.min(1)]),
        [formNames.intervalType]: new FormControl(null, [Validators.required])
      }),
      [formNames.pinnedGroup]: new FormGroup({
        [formNames.catalogs]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.notes]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.bookmarks]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.files]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        }),
        [formNames.videos]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        })
      }),
      [formNames.alarmGroup]: new FormGroup({
        [formNames.name]: new FormControl('', [
          TaskValidator.nameRequired,
          Validators.maxLength(Length.maxAlarmNameLength)]),
        [formNames.content]: new FormControl(''),
        [formNames.catalogs]: new FormGroup({
          [formNames.items]: new FormArray([]),
          [formNames.search]: new FormControl()
        })
      }),
      [formNames.notificationsGroup]: new FormArray([PeriodicFormFactory.getNotificationPart()])
    });
  }

  public static getNotificationPart(): FormGroup {
    return new FormGroup({
      [formNames.notificationTime]: new FormControl('', [TaskValidator.notificationTimeRequired]),
      [formNames.notificationType]: new FormControl('', [TaskValidator.notificationTimeRequired]),
      [formNames.interval]: new FormControl(1),
      [formNames.typesGroup]: new FormGroup({
        [formNames.items]: new FormArray([], [TaskValidator.notificationTypesRequired]),
        [formNames.search]: new FormControl()
      })
    });
  }
}

export abstract class SubtaskFormFactory {
  public static getForm(): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl('', [Validators.required, Validators.maxLength(Length.maxTaskNameLength)])
    });
  }
}
