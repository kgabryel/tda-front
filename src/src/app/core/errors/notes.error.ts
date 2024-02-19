export interface NotesErrors {
  name: string[],
  content: string[],
  backgroundColor: string[],
  textColor: string[]
}

export const notesErrors: NotesErrors = {
  'name': [
    'required'
  ],
  'content': [
    'required'
  ],
  'backgroundColor': [
    'required'
  ],
  'textColor': [
    'required'
  ]
};
