export interface Note {
  id: number;
  name: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  date: string;
  assignedToDashboard: boolean;
  tasks: string[];
  catalogs: number[];
}
