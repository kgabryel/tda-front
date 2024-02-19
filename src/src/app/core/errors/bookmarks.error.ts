export interface BookmarksErrors {
  href: string[],
  name: string[],
  backgroundColor: string[],
  textColor: string[];
  icon: string[];
}

export const bookmarksErrors: BookmarksErrors = {
  'href': [
    'required',
    'url'
  ],
  'name': [
    'required'
  ],
  'backgroundColor': [
    'required'
  ],
  'textColor': [
    'required'
  ],
  'icon': [
    'url'
  ]
};
