export interface VideosError {
  href: string[];
  name: string[];
}

export const videosErrors: VideosError = {
  'href': [
    'required',
    'url'
  ],
  'name': [
    'required'
  ]
};
