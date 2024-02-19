export interface BookmarkRequest {
  name: string;
  href: string;
  backgroundColor: string;
  textColor: string;
  icon: string | null;
  assignedToDashboard: boolean;
  catalogs: number[];
  tasks: string[];
}

export interface IconRequest {
  href: string;
}

export interface IconResult {
  icon: string;
}
