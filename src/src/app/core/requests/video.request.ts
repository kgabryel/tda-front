export interface VideoRequest {
  href: string;
  catalogs: number[];
  tasks: string[];
  assignedToDashboard: boolean;
}

export interface EditVideoRequest {
  name: string | null;
  watched: boolean | null;
  assignedToDashboard: boolean | null;
  catalogs: number[];
  tasks: string[];
}

export interface WatchedRequest {
  watched: boolean;
}
