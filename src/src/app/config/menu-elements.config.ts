import {RoutingConfig} from './routing.config';
import {PathUtils} from '../core/utils/path.utils';
import {MenuElementData} from '../core/data/menu-element.data';

export const menuElements: MenuElementData[] = [
  {name: 'dashboard', href: PathUtils.concatPath(RoutingConfig.home)},
  {name: 'settings', href: PathUtils.concatPath(RoutingConfig.settings)},
  {name: 'catalogs', href: PathUtils.concatPath(RoutingConfig.catalogs)},
  {name: 'tasks', href: PathUtils.concatPath(RoutingConfig.tasks)},
  {name: 'addTask', href: PathUtils.concatPath(RoutingConfig.tasks, RoutingConfig.create)},
  {name: 'alarms', href: PathUtils.concatPath(RoutingConfig.alarms)},
  {name: 'addAlarm', href: PathUtils.concatPath(RoutingConfig.alarms, RoutingConfig.create)},
  {name: 'notes', href: PathUtils.concatPath(RoutingConfig.notes)},
  {name: 'bookmarks', href: PathUtils.concatPath(RoutingConfig.bookmarks)},
  {name: 'files', href: PathUtils.concatPath(RoutingConfig.files)},
  {name: 'videos', href: PathUtils.concatPath(RoutingConfig.videos)}
];

export const withSingleView = [
  PathUtils.concatPath(RoutingConfig.catalogs),
  PathUtils.concatPath(RoutingConfig.alarms),
  PathUtils.concatPath(RoutingConfig.tasks),
  PathUtils.concatPath(RoutingConfig.notes)
];
