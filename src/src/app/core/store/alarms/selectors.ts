import {adapter, key, State} from './reducers';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Alarm, AlarmSearch} from '../../models/alarm';
import {EntityState} from '@ngrx/entity';
import {Catalog} from '../../models/catalog';
import {Search} from '../../services/alarms-search/alarms-search.service';
import {StringUtils} from '../../utils/string.utils';
import * as moment from 'moment';

const selectState = createFeatureSelector<State>(key);

const alarmsState = createSelector(
  selectState,
  (selectState: State) => selectState.alarms
);

export const selectAlarms = createSelector(
  adapter.getSelectors(alarmsState).selectAll,
  (alarms: Alarm[]) => alarms.sort((a, b) => (a.order < b.order) ? 1 : -1)
);

export const selectMainAlarms = createSelector(
  selectAlarms,
  (alarms: Alarm[]) => alarms.filter(alarm => alarm.group === null || alarm.group === undefined)
);

export const selectSingleMainAlarms = createSelector(
  selectAlarms,
  (alarms: Alarm[]) => alarms.filter(alarm => alarm.group === null && alarm.periodic === false)
);

export const selectSingleAlarms = createSelector(
  selectAlarms,
  (alarms: Alarm[]) => alarms.filter(alarm => !alarm.periodic)
);

export const searchAlarms = (search: Search) => createSelector(
  selectMainAlarms,
  (alarms: Alarm[]) => alarms.filter(alarm => {
    if (!StringUtils.stringIncludes(alarm.name ?? '', search.name)) {
      return false;
    }
    if (!StringUtils.stringIncludes(alarm.content ?? '', search.content)) {
      return false;
    }
    if (search.catalogs.length > 0) {
      if (!search.catalogs.some(catalog => alarm.catalogs.includes(catalog))) {
        return false;
      }
    }
    if (search.task !== null) {
      if (search.task) {
        if (alarm.task === null) {
          return false;
        }
      } else {
        if (alarm.task !== null) {
          return false;
        }
      }
    }
    if (search.type !== null) {
      if (search.type) {
        if (alarm.periodic) {
          return false;
        }
        if (search.startDate !== null) {
          let correct = false;
          alarm.notifications.forEach(notification => {
            if (notification.checked) {
              return;
            }
            if (moment(notification.time).isAfter(moment(search.startDate))) {
              correct = true;
            }
            return;
          });
          if (!correct) {
            return false;
          }
        }
        if (search.stopDate !== null) {
          let correct = false;
          alarm.notifications.forEach(notification => {
            if (notification.checked) {
              return;
            }
            if (moment(search.stopDate).isAfter(moment(notification.time))) {
              correct = true;
            }
            return;
          });
          if (!correct) {
            return false;
          }
        }
      } else {
        if (!alarm.periodic) {
          return false;
        }
      }
    }
    if (search.status !== null) {
      if (alarm.periodic) {
        if (alarm.active === search.status) {
          return false;
        }
      } else {
        if (!alarm.checked === search.status) {
          return false;
        }
      }
    }
    return true;
  })
);

export const selectAlarm = (id: string) => createSelector(
  alarmsState,
  (alarms: EntityState<Alarm>) => alarms.entities[id]
);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState) => selectState.loaded
);

export const findForCatalog = (catalog: Catalog) => createSelector(
  selectAlarms,
  (alarms: Alarm[]) => (alarms.filter((alarm: Alarm) => alarm.catalogs.includes(catalog.id)))
);

export const selectAlarmsForGroup = (id: string, search: AlarmSearch) => createSelector(
  selectAlarms,
  (alarms: Alarm[]) => alarms.filter(alarm => {
    if (alarm.group !== id) {
      return false;
    }
    if (search.checked !== null) {
      if (!alarm.checked === search.checked) {
        return false;
      }
    }
    if (search.start !== null) {
      let correct = false;
      alarm.notifications.forEach(notification => {
        if (moment(notification.time).isAfter(moment(search.start))) {
          correct = true;
        }
        return;
      });
      if (!correct) {
        return false;
      }
    }
    if (search.stop !== null) {
      let correct = false;
      alarm.notifications.forEach(notification => {
        if (moment(search.stop).isAfter(moment(notification.time))) {
          correct = true;
        }
        return;
      });
      if (!correct) {
        return false;
      }
    }
    return true;
  })
);
