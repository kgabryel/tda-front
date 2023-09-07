export interface NoteRequest {
  name: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  assignedToDashboard: boolean;
  catalogs: number[];
  tasks: string[];
}
