export interface Type {
  value: string,
  name: string
}

export const intervalAlarmTypes: Type[] = [
  {value: 'day', name: 'days'},
  {value: 'week', name: 'weeks'},
  {value: 'month', name: 'months'}
];

export const intervalNotificationTypes: Type[] =
  [
    {value: '-1', name: 'previousDay'},
    {value: '0', name: 'currentDay'},
    {value: '1', name: 'nextDay'},
    {value: '2', name: 'day'},
    {value: '3', name: 'week'},
    {value: '4', name: 'month'}
  ];
export const intervalValues: Map<string, number> = new Map<string, number>([
  ['-1', 1],
  ['0', 1],
  ['1', 1],
  ['2', 365],
  ['3', 52],
  ['4', 12]
]);
export const labels: Map<string, string> = new Map<string, string>([
  ['-1', 'form.label.interval'],
  ['0', 'form.label.interval'],
  ['1', 'form.label.interval'],
  ['2', 'form.label.intervalDays'],
  ['3', 'form.label.intervalWeeks'],
  ['4', 'form.label.intervalMonths']
]);
