export interface AuthRequest {
  email: string;
  password: string;
  lang: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}
