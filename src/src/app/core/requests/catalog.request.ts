export interface CatalogRequest {
  name: string;
  tasks: string[];
  alarms: string[];
  notes: number[];
  bookmarks: number[];
  files: number[];
  videos: number[];
  assignedToDashboard: boolean;
}
