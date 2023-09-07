export interface SingleAlarmErrors {
  name: string[],
  types: string[],
  notificationTime: string[]
}

export interface PeriodicAlarmErrors {
  name: string[],
  startDate: string[];
  endDate: string[];
  interval: string[];
  intervalType: string[];
  types: string[];
  notificationTime: string[];
  notificationType: string[];
}

export const singleAlarmErrors: SingleAlarmErrors = {
  'name': [
    'required'
  ],
  'types': [
    'required'
  ],
  'notificationTime': [
    'required'
  ]
};

export const periodicAlarmErrors: PeriodicAlarmErrors = {
  'name': [
    'required'
  ],
  'startDate': [
    'required'
  ],
  'endDate': [
    'sameDates'
  ],
  'interval': [
    'required'
  ],
  'intervalType': [
    'required'
  ],
  'notificationTime': [
    'required'
  ],
  'notificationType': [
    'required'
  ],
  'types': [
    'required'
  ]
};
