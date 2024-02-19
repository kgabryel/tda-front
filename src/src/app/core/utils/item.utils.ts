import {Item} from '../models/item';
import {Note} from '../models/note';
import {Video} from '../models/video';
import {File} from '../models/file';
import {Alarm} from '../models/alarm';
import {Task} from '../models/task';
import {Bookmark} from '../models/bookmark';
import {NotificationType} from '../models/notification-type';
import {Catalog} from '../models/catalog';
import {TaskStatus} from '../models/task-status';

export abstract class ItemUtils {

  public static notesToItems(notes: Note[]): Item[] {
    return notes.map(note => ItemUtils.noteToItem(note));
  }

  public static noteToItem(note: Note): Item {
    return {
      display: note.name,
      value: note.id.toString()
    };
  }

  public static videosToItems(videos: Video[]): Item[] {
    return videos.map(video => ItemUtils.videoToItem(video));
  }

  public static videoToItem(video: Video): Item {
    return {
      display: video.name,
      value: video.id.toString()
    };
  }

  public static filesToItems(files: File[]): Item[] {
    return files.map(file => ItemUtils.fileToItem(file));
  }

  public static fileToItem(file: File): Item {
    return {
      display: file.name,
      value: file.id.toString()
    };
  }

  public static alarmsToItems(alarms: Alarm[]): Item[] {
    return alarms.map(alarm => ItemUtils.alarmToItem(alarm));
  }

  public static alarmToItem(alarm: Alarm): Item {
    return {
      display: alarm.name,
      value: alarm.id
    };
  }

  public static tasksToItems(tasks: Task[]): Item[] {
    return tasks.map(task => ItemUtils.taskToItem(task));
  }

  public static taskToItem(task: Task): Item {
    return {
      display: task.name,
      value: task.id
    };
  }

  public static taskStatusToItem(status: TaskStatus): Item {
    return {
      display: 'taskStatuses.' + status.name,
      value: status.id.toString()
    };
  }

  public static bookmarksToItems(bookmarks: Bookmark[]): Item[] {
    return bookmarks.map(bookmark => ItemUtils.bookmarkToItem(bookmark));
  }

  public static bookmarkToItem(bookmark: Bookmark): Item {
    return {
      display: bookmark.name,
      value: bookmark.id.toString()
    };
  }

  public static notificationTypeToItem(notificationType: NotificationType): Item {
    return {
      display: notificationType.name,
      value: notificationType.id.toString()
    };
  }

  public static catalogsToItems(catalogs: Catalog[]): Item[] {
    return catalogs.map(catalog => ItemUtils.catalogToItem(catalog));
  }

  public static catalogToItem(catalog: Catalog): Item {
    return {
      display: catalog.name,
      value: catalog.id.toString()
    };
  }
}
