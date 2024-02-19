import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, key, State} from './reducers';
import {startOfDay} from 'date-fns';
import {EntityState} from '@ngrx/entity';
import {Task, TaskSearch} from '../../models/task';
import {StringUtils} from '../../utils/string.utils';
import {Catalog} from '../../models/catalog';
import {Search} from '../../services/tasks-search/tasks-search.service';
import * as moment from 'moment';

const selectState = createFeatureSelector<State>(key);

const tasksState = createSelector(
  selectState,
  (selectState: State) => selectState.tasks
);

export const selectTasks = createSelector(
  adapter.getSelectors(tasksState).selectAll,
  (tasks: Task[]) => tasks.sort((a, b) => (a.order < b.order) ? 1 : -1)
);

export const selectMainTasks = createSelector(
  selectTasks,
  (tasks: Task[]) => (tasks.filter((task) => ((task.parentId === null || task.parentId === undefined) && !task.periodic && (task.group === null || task.group === undefined)) || task.periodic))
);

export const selectSingleMainTasks = createSelector(
  selectTasks,
  (tasks: Task[]) => (tasks.filter((task) => ((task.parentId === null || task.parentId === undefined) && !task.periodic && (task.group === null || task.group === undefined))))
);

export const searchTasks = (search: Search, doneStatusId: number, rejectedStatusId: number) => createSelector(
  selectMainTasks,
  (tasks: Task[]) => tasks.filter(task => {
    if (!StringUtils.stringIncludes(task.name ?? '', search.name)) {
      return false;
    }
    if (!StringUtils.stringIncludes(task.content ?? '', search.content)) {
      return false;
    }
    if (search.alarm !== null) {
      if (search.alarm) {
        if (task.alarm === null) {
          return false;
        }
      } else {
        if (task.alarm !== null) {
          return false;
        }
      }
    }
    if (search.hideDone === true && !task.periodic) {
      if (task.status === doneStatusId) {
        return false;
      }
    }
    if (search.hideRejected === true && !task.periodic) {
      if (task.status === rejectedStatusId) {
        return false;
      }
    }
    if (search.type !== null) {
      if (search.type) {
        if (task.periodic) {
          return false;
        }
        if (search.date !== null) {
          if (search.date) {
            if (task.date === null) {
              return false;
            }
          } else {
            if (task.date !== null) {
              return false;
            }
          }
        }
        if (search.subtasks !== null) {
          if (search.subtasks) {
            if (task.subtasks.length === 0) {
              return false;
            }
          } else {
            if (task.subtasks.length > 0) {
              return false;
            }
          }
        }
        if (search.startDate !== null) {
          if (task.date === null) {
            return false;
          }
          if (moment(search.startDate).isAfter(moment(task.date))) {
            return false;
          }
        }
        if (search.stopDate !== null) {
          if (task.date === null) {
            return false;
          }
          if (moment(task.date).isAfter(moment(search.stopDate))) {
            return false;
          }
        }
        if (search.statuses.length > 0) {
          if (!search.statuses.includes(task.status)) {
            return false;
          }
        }
      } else {
        if (!task.periodic) {
          return false;
        }
        if (search.active !== null) {
          if (task.active !== search.active) {
            return false;
          }
        }
      }
    }
    if (search.catalogs.length > 0) {
      if (!search.catalogs.some(catalog => task.catalogs.includes(catalog))) {
        return false;
      }
    }
    if (search.notes.length > 0) {
      if (!search.notes.some(note => task.notes.includes(note))) {
        return false;
      }
    }
    if (search.bookmarks.length > 0) {
      if (!search.bookmarks.some(bookmark => task.bookmarks.includes(bookmark))) {
        return false;
      }
    }
    if (search.files.length > 0) {
      if (!search.files.some(file => task.files.includes(file))) {
        return false;
      }
    }
    if (search.videos.length > 0) {
      if (!search.videos.some(video => task.videos.includes(video))) {
        return false;
      }
    }
    return true;
  })
);

export const selectSubtasks = (id: string) => createSelector(
  selectTasks,
  (tasks: Task[]) => tasks.filter(task => task.parentId === id)
);

export const selectTasksForToday = (doneStatus: number, undoneStatus: number) => createSelector(
  selectTasks,
  (tasks: Task[]) => (tasks.filter((task) => (
    (task.status !== doneStatus && task.status !== undoneStatus) && (
      task.date === null || startOfDay(Date.parse(task.date)).getTime() === startOfDay(new Date()).getTime()
    ) && !task.periodic
  )))
);

export const selectUndoneTasks = (undoneStatus: number) => createSelector(
  selectTasks,
  (tasks: Task[]) => tasks.filter((task) => (task.status === undoneStatus && !task.periodic))
);

export const selectTasksToDone = createSelector(
  selectTasks,
  (tasks: Task[]) => (tasks.filter((task) => (task.status !== 4)))
);

export const selectMainTasksToDone = createSelector(
  selectTasks,
  (tasks: Task[]) => (tasks.filter((task) => (task.status !== 4 && task.parentId === null)))
);

export const selectTasksWithDate = createSelector(
  selectTasks,
  (tasks: Task[]) => (tasks.filter((task) => (task.date !== null && task.date !== undefined)))
);

export const selectTask = (id: string) => createSelector(
  tasksState,
  (tasks: EntityState<Task>) => tasks.entities[id]
);

export const selectIsLoaded = createSelector(
  selectState,
  (selectState) => selectState.loaded
);

export const searchPinned = (ids: string[], name: string) => createSelector(
  selectTasks,
  (tasks: Task[]) => tasks.filter(task => {
    if (!ids.includes(task.id)) {
      return false;
    }
    return StringUtils.stringIncludes(task.name, name);
  })
);

export const selectPinned = (id: string) => createSelector(
  selectTasks,
  (tasks: Task[]) => {
    let task = tasks.find(task => task.id === id);
    let catalogs = task?.catalogs ?? [];
    let bookmarks = task?.bookmarks ?? [];
    let files = task?.files ?? [];
    let notes = task?.notes ?? [];
    let videos = task?.videos ?? [];
    let subtasks = tasks.filter(task => task?.parentId === id);
    return {
      catalogs: catalogs,
      bookmarks: bookmarks,
      notes: notes,
      files: files,
      videos: videos,
      subtasksCatalogs: [...new Set([].concat(...subtasks.map(task => task.catalogs)))]
        .filter(x => !catalogs.includes(x)),
      subtasksBookmarks: [...new Set([].concat(...subtasks.map(task => task.bookmarks)))]
        .filter(x => !bookmarks.includes(x)),
      subtasksFiles: [...new Set([].concat(...subtasks.map(task => task.files)))]
        .filter(x => !files.includes(x)),
      subtasksNotes: [...new Set([].concat(...subtasks.map(task => task.notes)))]
        .filter(x => !notes.includes(x)),
      subtasksVideos: [...new Set([].concat(...subtasks.map(task => task.videos)))]
        .filter(x => !videos.includes(x)),
      content: task.content
    };
  }
);

export const findForCatalog = (catalog: Catalog) => createSelector(
  selectTasks,
  (tasks: Task[]) => (tasks.filter((task: Task) => task.catalogs.includes(catalog.id)))
);

export const selectTasksForGroup = (id: string, search: TaskSearch) => createSelector(
  selectTasks,
  (tasks: Task[]) => {
    return tasks.filter(task => {
      if (task.group !== id) {
        return false;
      }
      if (search.statuses.length > 0) {
        if (!search.statuses.includes(task.status)) {
          return false;
        }
      }
      if (search.start !== null) {
        if (task.date === null) {
          return false;
        }
        if (moment(search.start).isAfter(moment(task.date))) {
          return false;
        }
      }
      if (search.stop !== null) {
        if (task.date === null) {
          return false;
        }
        if (moment(task.date).isAfter(moment(search.stop))) {
          return false;
        }
      }
      return true;
    });
  }
);

export const selectUndoneOrNotRejectedSubtasks = (id: string, doneStatusId: number, rejectedStatusId) => createSelector(
  selectTasks,
  (tasks: Task[]) => (tasks.filter((task) => (task.parentId === id && !(task.status === doneStatusId || task.status === rejectedStatusId))))
);
