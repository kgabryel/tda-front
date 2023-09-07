export interface File {
  id: number;
  name: string;
  originalName: string;
  size: number;
  assignedToDashboard: boolean;
  parsedSize: string;
  createdAt: string;
  updatedAt: string | null;
  extension: string;
  tasks: string[];
  catalogs: number[];
}
