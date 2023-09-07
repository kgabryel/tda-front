export interface ChangePasswordErrors {
  currentPassword: string[],
  password: string[],
  repeatPassword: string[];
}

export const changePasswordErrors: ChangePasswordErrors = {
  'currentPassword': [
    'required'
  ],
  'password': [
    'required'
  ],
  'repeatPassword': [
    'required',
    'differentPasswords'
  ]
};
