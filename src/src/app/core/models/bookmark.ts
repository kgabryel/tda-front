export interface Bookmark {
  id: number;
  name: string;
  href: string;
  backgroundColor: string;
  textColor: string;
  icon: string | null;
  assignedToDashboard: boolean;
  tasks: string[];
  catalogs: number[];
}
