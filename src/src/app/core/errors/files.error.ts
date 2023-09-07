export interface FilesError {
  name: string[],
  file: string[]
}

export const filesErrors: FilesError = {
  'name': [
    'required'
  ],
  'file': [
    'required',
    'maxSize'
  ]
};
