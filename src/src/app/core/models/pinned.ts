export interface Pinned<T> {
  deletable: boolean;
  item: T;
}

export interface PinnedId {
  deletable: boolean;
  id: number;
}
