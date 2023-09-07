export interface FileRequest {
  name: string;
  file: File;
  catalogs: number[];
  tasks: string[];
  assignedToDashboard: boolean;
}

export interface EditFileRequest {
  name: string | null;
  catalogs: number[] | null;
  tasks: string[] | null;
  assignedToDashboard: boolean | null;
}

export interface ReplaceFileRequest {
  file: File;
}
