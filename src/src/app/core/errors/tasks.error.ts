export interface SingleTaskErrors {
  name: string[],
  notification: string[];
  mainTask: string[];
}

export interface PeriodicTaskErrors {
  name: string[],
  notification: string[];
  startDate: string[];
  endDate: string[];
  interval: string[];
  intervalType: string[];
}

export const singleTaskErrors: SingleTaskErrors = {
  'name': [
    'required'
  ],
  'notification': [
    'required'
  ],
  'mainTask': [
    'required'
  ]
};

export const periodicTaskErrors: PeriodicTaskErrors = {
  'name': [
    'required'
  ],
  'notification': [
    'required'
  ],
  'startDate': [
    'required'
  ],
  'endDate': [
    'invalidValue',
    'sameDates'
  ],
  'interval': [
    'required',
    'invalidValue'
  ],
  'intervalType': [
    'required',
    'invalidValue'
  ]
};
