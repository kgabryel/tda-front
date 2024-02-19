export interface ChangePasswordRequest {
  password: string;
  passwordRepeat: string;
  oldPassword: string;
}
