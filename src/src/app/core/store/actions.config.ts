export enum Prefixes {
  alarms = '[Alarms]',
  bookmarks = '[Bookmarks]',
  notes = '[Notes]',
  tasks = '[Tasks]',
  files = '[Files]',
  tasksStatuses = '[Tasks Statuses]',
  videos = '[Videos]',
  colors = '[Colors]',
  catalogs = '[Catalogs]',
  notificationTypes = '[NotificationTypes]',
  notifications = '[Notifications]',
  settings = '[Settings]'
}

export enum Actions {
  load = 'Load',
  loadError = 'Load Error',
  loadSuccess = 'Load Success',
  reload = 'Reload',
  reloadError = 'Reload Error',
  reloadSuccess = 'Reload Success',
  add = 'Add',
  addGroup = 'Add Group',
  addSingle = 'Add Single',
  addPeriodic = 'Add Periodic',
  addError = 'Add Error',
  addSuccess = 'Add Success',
  delete = 'Delete',
  deleteSingle = 'Delete Single',
  deletePeriodic = 'Delete Periodic',
  deleteError = 'Delete Error',
  deleteSuccess = 'Delete Success',
  update = 'Update',
  replace = 'Replace',
  undoFromDashboard = 'Undo From Dashboard',
  alarmRemove = 'Alarm Remove',
  catalogRemove = 'Catalog Remove',
  catalogAdd = 'Catalog Add',
  noteAdd = 'Note Add',
  bookmarkAdd = 'Bookmark Add',
  fileAdd = 'File Add',
  videoAdd = 'Video Add',
  taskRemove = 'Task Remove',
  noteRemove = 'Note Remove',
  bookmarkRemove = 'Bookmark Remove',
  fileRemove = 'file Remove',
  videoRemove = 'Video Remove',
  updateSingleName = 'Update Single Name',
  updateSingleContent = 'Update Single Content',
  updateSingleDate = 'Update Single Date',
  updateSingleMainTask = 'Update Single MainTask',
  updateSingleAlarm = 'Update Single Alarm',
  updatePeriodicName = 'Update Periodic Name',
  updatePeriodicContent = 'Update Periodic Content',
  updateSingleTask = 'update Single Task',
  updateError = 'Update Error',
  updateSuccess = 'Update Success',
  reset = 'Reset',
  check = 'Check',
  uncheck = 'Uncheck',
  checkError = 'Check Error',
  uncheckError = 'UncheckError',
  uncheckModified = 'Uncheck Modified',
  uncheckUnmodified = 'Uncheck Unmodified',
  changeEmail = 'Change Email',
  changeEmailSuccess = 'Change Email Success',
  changeEmailError = 'Change Email Error',
  confirmEmail = 'Confirm Email',
  confirmEmailSuccess = 'Confirm Email Success',
  confirmEmailError = 'Confirm Email Error',
  changeSettings = 'Change Settings',
  changeSettingsSuccess = 'Change Settings Success',
  changeSettingsError = 'Change Settings Error',
  changeStatus = 'change Status',
  changeStatusError = 'change Status Error',
  disableSingle = 'disable Single',
  disableError = 'disable Error',
  activate = 'activate',
  deactivate = 'deactivate'
}
