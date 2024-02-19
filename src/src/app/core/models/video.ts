export interface Video {
  id: number;
  name: string;
  ytId: string;
  assignedToDashboard: boolean;
  watched: boolean;
  tasks: string[];
  catalogs: number[];
}
