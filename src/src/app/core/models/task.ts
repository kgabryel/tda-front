export interface Task {
  id: string;
  name: string;
  content: string;
  date: string | null;
  status: number;
  parentId: string | null;
  subtasks: number[],
  alarm: string | null,
  periodic: boolean;
  tasks: string[] | null;
  group: string | null;
  catalogs: number[];
  bookmarks: number[];
  notes: number[];
  files: number[];
  videos: number[];
  start: string | null;
  stop: string | null;
  interval: number | null;
  intervalType: string | null;
  active: boolean;
  order: number;
}

export interface TaskSearch {
  statuses: number[],
  start: Date | null,
  stop: Date | null
}

export interface PinnedItems {
  catalogs: number[];
  bookmarks: number[];
  notes: number[];
  files: number[];
  videos: number[];
  subtasksCatalogs: number[];
  subtasksBookmarks: number[];
  subtasksNotes: number[];
  subtasksFiles: number[];
  subtasksVideos: number[];
  content: string;
}
