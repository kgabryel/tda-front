export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenData {
  access_token;
  refresh_token;
  isCorrect;
}

export interface TokensData {
  access_token;
  refresh_token;
  isCorrect;
  errorMessage;
}
