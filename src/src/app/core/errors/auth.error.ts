export interface AuthErrors {
  email: string[],
  password: string[]
}

export interface ResetPasswordErrors {
  password: string[],
  repeatPassword: string[]
}

export const authErrors: AuthErrors = {
  'email': [
    'required',
    'email'
  ],
  'password': [
    'required'
  ]
};
export const resetPasswordErrors: ResetPasswordErrors = {
  'password': [],
  'repeatPassword': []
};
