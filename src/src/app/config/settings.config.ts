import {FormControl} from '@angular/forms';

export const settingsConfig: string[] = [
  'hide-done-tasks',
  'hide-rejected-tasks',
  'hide-inactive-alarms',
  'hide-done-subtasks',
  'hide-inactive-notifications',
  'hide-done-tasks-in-tasks-groups',
  'hide-inactive-alarms-in-alarms-groups',
  'autocomplete'
];
export const availableLanguages = ['pl', 'en'];
export const settingsFields: Map<string, FormControl> = new Map<string, FormControl>();
settingsFields.set('hideDoneTasks', new FormControl());
settingsFields.set('hideRejectedTasks', new FormControl());
settingsFields.set('hideInactiveAlarms', new FormControl());
settingsFields.set('hideDoneSubtasks', new FormControl());
settingsFields.set('hideInactiveNotifications', new FormControl());
settingsFields.set('hideDoneTasksInTasksGroups', new FormControl());
settingsFields.set('hideInactiveAlarmsInAlarmsGroups', new FormControl());
settingsFields.set('autocomplete', new FormControl());
export const availableModes = ['light', 'dark'];
