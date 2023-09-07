export interface Catalog {
  id: number;
  name: string;
  assignedToDashboard: boolean;
  tasks: string[];
  alarms: string[];
  notes: number[];
  bookmarks: number[];
  files: number[];
  videos: number[];
}
