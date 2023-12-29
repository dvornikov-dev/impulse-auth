export interface JwtPayload {
  id: number;
  email: string;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AccessTokenResponse {
  accessToken: string;
}
