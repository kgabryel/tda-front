export interface ColorsError {
  name: string[],
  color: string[]
}

export const colorsErrors: ColorsError = {
  'name': [
    'required'
  ],
  'color': [
    'required'
  ]
};
